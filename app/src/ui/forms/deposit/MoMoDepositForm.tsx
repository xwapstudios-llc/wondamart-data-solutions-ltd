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
import {useAppStore} from "@/lib/useAppStore.ts";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {cn} from "@/cn/lib/utils.ts";
import {Input} from "@/cn/components/ui/input.tsx";
import {Button} from "@/cn/components/ui/button.tsx";
import {Loader2Icon} from "lucide-react";
import {ClTxAccountDeposit} from "@common/client-api/tx-account-deposit.ts";
import Code from "@/ui/components/typography/Code.tsx";
import type {HTTPResponse} from "@common/types/request.ts";


const formSchema = z.object({
    phone: z.string().regex(/^(0|\+233|233)[25][0-9]{8}$/, "Invalid phone number format"),
    amount: z.coerce.number().min(11, "Amount must be higher than 11.0"),
});
type formValues = z.infer<typeof formSchema>;

type PaystackDepositFormProps = React.HTMLAttributes<HTMLFormElement>;

const PaystackDepositForm: React.FC<PaystackDepositFormProps> = ({className, children, ...props}) => {
    const {profile, setError, setHTTPResponse, commonSettings} = useAppStore();
    const [loading, setLoading] = useState(false);
    const form = useForm<formValues>({
        resolver: zodResolver(formSchema) as never,
    });

    const handleOnSubmit = async (values: formValues) => {
        if (commonSettings.paymentMethods.momo.enabled) {
            setLoading(true);
            if (profile) {
                try {
                    const response = await ClTxAccountDeposit.create.momo({
                        uid: profile.id,
                        phoneNumber: values.phone,
                        amount: values.amount,
                    })
                    setHTTPResponse(response);
                    form.reset();
                } catch (err) {
                    if (typeof err === "string") {
                        setError(err);
                    } else if (typeof err === "object") {
                        setHTTPResponse(err as HTTPResponse);
                    } else {
                        setError({
                            title: "Error",
                            description: JSON.stringify(err)
                        });
                    }
                }
            }
            setLoading(false);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleOnSubmit)} className={cn("space-y-4", className)} {...props}>

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
                                <Input className={"h-12"} type={"number"} placeholder={"50"} {...field} />
                            </FormControl>
                            <FormDescription>Amount of money in cedies to deposit into account. Minimum <Code>₵
                                11.0</Code></FormDescription>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                <Button type="submit" size={"lg"} className={"w-full"}
                        disabled={loading && commonSettings.paymentMethods.momo.enabled}>
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