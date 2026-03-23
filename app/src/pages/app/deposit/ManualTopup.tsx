import React from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/cn/components/ui/button.tsx";
import { Input } from "@/cn/components/ui/input.tsx";
import { Label } from "@/cn/components/ui/label.tsx";
import { toast } from "sonner";
import { PhoneIcon } from "lucide-react";
import {useAppStore} from "@/lib/useAppStore.ts";

const schema = z.object({
    amount: z.coerce.number("Enter a valid amount")
        .min(50, "Amount must be at least GH₵ 50"),
    phone: z
        .string()
        .min(1, "Phone number is required")
        .regex(/^0[235][0-9]{8}$/, "Enter a valid Ghanaian mobile number (e.g. 0241234567)"),
    momoName: z.string().min(2, "MoMo Name is required"),
    accountName: z.string().min(2, "Account Name is required"),
});

type ManualTopupForm = z.infer<typeof schema>;

const ManualTopup: React.FC = () => {
    const {user} = useAppStore();

    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ManualTopupForm>({
        resolver: zodResolver(schema as never),
        defaultValues: { amount: undefined, phone: "", momoName: "", accountName: user?.displayName ?? "No Name" },
    });

    const onSubmit = (data: ManualTopupForm) => {

        // Todo: API call
        console.log("Manual Topup Data:", data);

        // Simulate sending request
        toast.success("Manual topup request submitted!", {
            description: `Amount: GH₵ ${data.amount} · Phone: ${data.phone}. Our team will process your request shortly.`,
            duration: 8000,
        });

        // Todo: Then after, Show reference code.
        // Todo: And instructions to do the transaction and contact admin after making payment.
        reset();
    };

    return (
        <div className="rounded-xl border bg-card p-5 space-y-1">
            <div className="flex items-center gap-3 mb-4">
                <div className="flex size-9 items-center justify-center rounded-md bg-green-500 text-white">
                    <PhoneIcon className="size-5" />
                </div>
                <div>
                    <p className="font-semibold text-sm">Manual Topup</p>
                    <p className="text-xs text-muted-foreground">Request deposit via phone number</p>
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
                        placeholder="e.g. 50 or more"
                        {...register("amount")}
                    />
                    {errors.amount && <p className="text-xs text-destructive">{errors.amount.message}</p>}
                </div>

                <div className="space-y-1.5">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                        id="phone"
                        type="tel"
                        placeholder="e.g. 0241234567"
                        {...register("phone")}
                    />
                    {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
                </div>

                <div className="space-y-1.5">
                    <Label htmlFor="phone">Mobile Money Name</Label>
                    <Input
                        id="momoName"
                        type="name"
                        placeholder="e.g. Jhon Doe"
                        {...register("momoName")}
                    />
                    {errors.momoName && <p className="text-xs text-destructive">{errors.momoName.message}</p>}
                </div>

                {/*Todo: Submission to api should include account name*/}
                <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                    Submit Request
                </Button>
            </form>
        </div>
    );
};

export default ManualTopup;
