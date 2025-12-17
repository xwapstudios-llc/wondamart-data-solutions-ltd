import React, {useState} from "react";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/cn/components/ui/form.tsx";
import {z} from "zod";
import {type NetworkId, networkIds} from "@common/types/data-bundle.ts";
import {useAppStore} from "@/lib/useAppStore.ts";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/cn/components/ui/select.tsx";
import {cn} from "@/cn/lib/utils.ts";
import {Input} from "@/cn/components/ui/input.tsx";
import {Button} from "@/cn/components/ui/button.tsx";
import {Loader2Icon} from "lucide-react";
import {ClTxAccountDeposit} from "@common/client-api/tx-account-deposit.ts";
import Code from "@/ui/components/typography/Code.tsx";


const formSchema = z.object({
    phone: z.string().regex(/^(0|\+233|233)[25][0-9]{8}$/, "Invalid phone number format"),
    network: z.enum([...networkIds, ""], "Select Network").refine((val) => val.length > 0),
    amount: z.coerce.number().min(5, "Amount must be higher than 5.0"),
});
type formValues = z.infer<typeof formSchema>;

type PaystackDepositFormProps = React.HTMLAttributes<HTMLFormElement>;

const PaystackDepositForm: React.FC<PaystackDepositFormProps> = ({className, children, ...props}) => {
    const {profile, setError, commonSettings} = useAppStore();
    const [loading, setLoading] = useState(false);
    const form = useForm<formValues>({
        resolver: zodResolver(formSchema) as never,
        defaultValues: {
            network: "",
            phone: "",
            amount: 0
        }
    });

    const handleOnSubmit = async (values: formValues) => {
        if (commonSettings.paymentMethods.paystack.enabled) {
            setLoading(true);
            if (profile) {
                try {
                    await ClTxAccountDeposit.create.paystack({
                        uid: profile.id,
                        email: profile.email,
                        phoneNumber: values.phone,
                        network: values.network as NetworkId,
                        amount: values.amount,
                    })
                    //Todo: Await response and check if OTP is required.
                    // If required, navigate to OTP page for confirmation
                    form.reset();
                } catch (err) {
                    setError(err as string);
                }
            }
            setLoading(false);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleOnSubmit)} className={cn("space-y-4", className)} {...props}>

                {/*Network*/}
                <FormField
                    control={form.control}
                    name={"network"}
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Network</FormLabel>
                            <FormControl>
                                <Select
                                    {...field}
                                    onValueChange={(val) => {
                                        form.setValue("network", val as NetworkId);
                                        form.trigger("network").then();
                                    }}
                                >
                                    <SelectTrigger className={"w-full"} size={"lg"}>
                                        <SelectValue placeholder={"Select Network"}/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value={"mtn"}>MTN</SelectItem>
                                        <SelectItem value={"telecel"}>Telecel</SelectItem>
                                        <SelectItem value={"airteltigo"}>AirtelTigo</SelectItem>
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormDescription></FormDescription>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                {/*phone*/}
                <FormField
                    control={form.control}
                    name={"phone"}
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Phone</FormLabel>
                            <FormControl>
                                <Input className={"h-12"} placeholder={"02XXXXXXXX"} {...field} />
                            </FormControl>
                            <FormDescription>Phone number to accept payment</FormDescription>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                {/*amount*/}
                <FormField
                    control={form.control}
                    name={"amount"}
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Amount</FormLabel>
                            <FormControl>
                                <Input className={"h-12"} type={"number"} placeholder={"5.5"} {...field} />
                            </FormControl>
                            <FormDescription>Amount of money in cedies to deposit into account. Minimum <Code>₵
                                5.0</Code></FormDescription>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                <FormItem>
                    <FormLabel>Expected Amount</FormLabel>
                    <FormControl>
                        <Input className={"h-12"} type={"number"} placeholder={"5.5"} value={form.watch("amount") + (form.watch("amount") * 0.02)} />
                    </FormControl>
                    <FormDescription>Amount of money in cedies to confirm on your phone.</FormDescription>
                    <FormMessage/>
                </FormItem>

                {
                    loading && <p className={"text-destructive"}>
                        <Code>Loading...</Code> Do not refresh page or switch payment method
                    </p>
                }
                <Button type="submit" size={"lg"} className={"w-full"}
                        disabled={loading && commonSettings.paymentMethods.paystack.enabled}>
                    {
                        loading ? <>
                            <Loader2Icon className={"animate-spin"}/> Loading
                        </> : "Deposit"
                    }
                </Button>
                {children}
            </form>
        </Form>
    )
}

export default PaystackDepositForm;