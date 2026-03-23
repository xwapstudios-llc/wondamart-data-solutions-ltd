import React, { useEffect } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/cn/components/ui/button.tsx";
import { Input } from "@/cn/components/ui/input.tsx";
import { Label } from "@/cn/components/ui/label.tsx";
import { payWithPaystack, type PaystackCallbackResponse } from "@/lib/pay_with_paystack.ts";
import { useAppStore } from "@/lib/useAppStore.ts";
import { toast } from "sonner";
import { DollarSignIcon } from "lucide-react";
import {toCurrency} from "@/lib/icons.ts";

const PAYSTACK_KEY = "pk_live_704d05b79ca60b777090991d8d5c2c6354346219";

const schema = z.object({
    amount: z.coerce.number("Enter a valid amount")
        .min(1, "Amount must be at least GH₵ 1"),
});

type DepositForm = z.infer<typeof schema>;

const PaystackDeposit: React.FC = () => {
    const { user, profile } = useAppStore();

    const { register, handleSubmit, reset, formState: { errors, isSubmitting }, watch } = useForm<DepositForm>({
        resolver: zodResolver(schema as never),
        defaultValues: { amount: undefined },
    });

    const watchedAmount = watch("amount");

    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://js.paystack.co/v1/inline.js";
        script.async = true;
        document.head.appendChild(script);
        return () => { document.head.removeChild(script); };
    }, []);

    const onSubmit = (data: DepositForm) => {
        const email = user?.email || "";
        // if (!email) {
        //     toast.error("An email address is required to proceed.");
        //     return;
        // }

        const toastId = toast.loading("Opening Paystack…");

        payWithPaystack({
            key: PAYSTACK_KEY,
            currency: "GHS",
            email,
            amount: (data.amount + (data.amount * 0.02)) * 100, // pesewas
            metadata: {
                custom_fields: [
                    { display_name: "Agent ID", variable_name: "agent_id", value: user?.uid ?? "" },
                    { display_name: "Name", variable_name: "name", value: profile?.firstName ?? "" },
                ],
            },
            callback: (response: PaystackCallbackResponse) => {
                toast.dismiss(toastId);
                if (response.status === "success") {
                    toast.success("Payment successful! Your deposit is being processed.", {
                        description: `Reference: ${response.reference}`,
                        duration: 8000,
                    });
                    reset();
                } else {
                    toast.error("Payment was not completed.", {
                        description: `Status: ${response.status} · Ref: ${response.reference}`,
                    });
                }
            },
            onClose: () => {
                toast.dismiss(toastId);
                toast.info("Payment window closed.");
            },
        });
    };

    const amount = Number(watchedAmount) || 0;
    const processingFee = amount * 0.02;
    const total = amount + processingFee;

    return (
        <div className="rounded-xl border bg-card p-5 space-y-1">
            <div className="flex items-center gap-3 mb-4">
                <div className="flex size-9 items-center justify-center rounded-md bg-blue-500 text-white">
                    <DollarSignIcon className="size-5" />
                </div>
                <div>
                    <p className="font-semibold text-sm">Instant Deposit</p>
                    <p className="text-xs text-muted-foreground">Via Paystack · 2% processing fee</p>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
                <div className="space-y-1.5">
                    <Label htmlFor="amount">Amount (GH₵)</Label>
                    <Input
                        id="amount"
                        type="number"
                        min={1}
                        step="0.01"
                        placeholder="e.g. 50"
                        {...register("amount")}
                    />
                    {errors.amount && <p className="text-xs text-destructive">{errors.amount.message}</p>}
                </div>

                {watchedAmount && (
                    <div className="text-sm space-y-1.5 px-2 py-3 bg-muted/50 rounded-lg">
                        <div className="flex justify-between">
                            <span className="opacity-70">Amount to deposit</span>
                            <span>{toCurrency(amount)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="opacity-70">Processing fee (2%)</span>
                            <span>{toCurrency(processingFee)}</span>
                        </div>
                        <div className="flex justify-between pt-1.5 border-t">
                            <span className="font-medium">Total to charge</span>
                            <span className="font-medium">{toCurrency(total)}</span>
                        </div>
                    </div>
                )}
                <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                    Pay with Paystack
                </Button>
            </form>
        </div>
    );
};

export default PaystackDeposit;
