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
import type {HTTPResponse} from "@common/types/request.ts";


const formSchema = z.object({
    transactionID: z.string().regex(/^[0-9]{8}$/, "Invalid transaction ID format"),
});
type formValues = z.infer<typeof formSchema>;

type SendDepositFormProps = React.HTMLAttributes<HTMLFormElement>;

const SendDepositForm: React.FC<SendDepositFormProps> = ({className, children, ...props}) => {
    const {profile, setError, setHTTPResponse, commonSettings} = useAppStore();
    const [loading, setLoading] = useState(false);
    const form = useForm<formValues>({
        resolver: zodResolver(formSchema) as never,
    });

    const handleOnSubmit = async (values: formValues) => {
        if (commonSettings.paymentMethods.send.enabled) {
            setLoading(true);
            if (profile) {
                try {
                    const response = await ClTxAccountDeposit.create.send({
                        uid: profile.id,
                        transactionID: values.transactionID
                    })
                    form.reset();
                    setHTTPResponse(response);
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

                {/*Transaction ID*/}
                <FormField
                    control={form.control}
                    name={"transactionID"}
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Transaction ID</FormLabel>
                            <FormControl>
                                <Input className={"h-12"} placeholder={"eg. 0123456789"} {...field} />
                            </FormControl>
                            <FormDescription>The transaction id from the confirmed message on your
                                phone</FormDescription>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                <Button type="submit" size={"lg"} className={"w-full"}
                        disabled={loading && commonSettings.paymentMethods.send.enabled}>
                    {
                        loading ? <>
                            <Loader2Icon className={"animate-spin"}/> Loading
                        </> : "Redeem"
                    }
                </Button>
                {children}
            </form>
        </Form>
    )
}

export default SendDepositForm;