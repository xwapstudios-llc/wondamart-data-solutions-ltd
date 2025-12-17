"use client";

import React, {useState} from "react";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {Tabs, TabsList, TabsTrigger, TabsContent} from "@/cn/components/ui/tabs";
import {Input} from "@/cn/components/ui/input";
import {Label} from "@/cn/components/ui/label";
import {Button} from "@/cn/components/ui/button";
import {useAppStore} from "@/lib/useAppStore";
import {ClTxAccountDeposit} from "@common/client-api/tx-account-deposit";
import {ClTxCommissionDeposit} from "@common/client-api/tx-commission-deposit";


const depositSchema = z.object({
    network: z.enum(["mtn", "telecel", "airteltigo", ""])
        .refine((val) => {
            return val != ""
        }, {message: "Please select a network"}),
    phone: z
        .string()
        .regex(/^(0|\+233|233)[25][0-9]{8}$/, "Invalid phone number format"),
    amount: z
        .string()
        .refine((val) => Number(val) > 0, {message: "Amount must be greater than 0"}),
});

const commissionDepositSchema = z.object({
    amount: z
        .string()
        .refine((val) => Number(val) > 0, {message: "Amount must be greater than 0"}),
});

type DepositValues = z.infer<typeof depositSchema>;
type CommissionDepositValues = z.infer<typeof commissionDepositSchema>;

interface DepositFormProps {
    onComplete?: () => void;
}
const DepositForm: React.FC<DepositFormProps> = ({onComplete}) => {
    const {profile, wallet, setLoading, setError} = useAppStore();
    const commissionBalance = wallet?.commission ?? 0;
    const form = useForm<DepositValues>({
        resolver: zodResolver(depositSchema),
        defaultValues: {
            network: "",
            phone: "",
            amount: "",
        },
    });
    const commissionForm = useForm<CommissionDepositValues>({
        resolver: zodResolver(commissionDepositSchema),
        defaultValues: {
            amount: "",
        },
    });

    const onSubmit = async (values: DepositValues) => {
        // Todo: Handle status
        if (profile && values.network !== "") {
            if (onComplete) onComplete();
            setLoading(true);
            try {
                await ClTxAccountDeposit.create({
                    uid: profile.id,
                    network: values.network,
                    phoneNumber: values.phone.trim(),
                    amount: Number(values.amount)
                });
                setLoading(false);
                form.reset();
            } catch (error) {
                setLoading(false);
                setError(error as string);
            }
        }
    };
    const onCommissionSubmit = async (values: CommissionDepositValues) => {
        // Todo: Handle status
        if (profile) {
            if (onComplete) onComplete();
            setLoading(true);
            try {
                await ClTxCommissionDeposit.create({
                    uid: profile.id,
                    amount: Number(values.amount)
                })
                setLoading(false);
                commissionForm.reset();
            } catch (error) {
                setLoading(false);
                setError(error as string);
            }
        }
    };

    const [method, setMethod] = useState<"mobile" | "commission">("mobile");

    return (
        <Tabs
            value={method}
            onValueChange={(val) => setMethod(val as "mobile" | "commission")}
        >
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="mobile">Mobile</TabsTrigger>
                <TabsTrigger value="commission" disabled={commissionBalance < 50}>
                    Commission
                </TabsTrigger>
            </TabsList>

            {/* Mobile Deposit */}
            <TabsContent value="mobile">
                <form onSubmit={form.handleSubmit(onSubmit)} className={"flex flex-col justify-between gap-4 min-h-80"}>
                    <div className={"space-y-4"}>
                        <div className={"space-y-2"}>
                            <Label className={"font-semibold"} htmlFor={"network"}>Network</Label>
                            <div className={"flex gap-2"} id={"network"}>
                                <Button
                                    type={"button"}
                                    variant={form.watch("network") == "mtn" ? "default" : "secondary"}
                                    onClick={async () => {
                                        form.setValue("network", "mtn")
                                        await form.trigger("network")
                                    }}
                                >
                                    MTN
                                </Button>
                                <Button
                                    type={"button"}
                                    variant={form.watch("network") == "telecel" ? "default" : "secondary"}
                                    onClick={async () => {
                                        form.setValue("network", "telecel")
                                        await form.trigger("network")
                                    }}
                                >
                                    Telecel
                                </Button>
                                <Button
                                    type={"button"}
                                    variant={form.watch("network") == "airteltigo" ? "default" : "secondary"}
                                    onClick={async () => {
                                        form.setValue("network", "airteltigo")
                                        await form.trigger("network")
                                    }}
                                >
                                    AirtelTigo
                                </Button>
                            </div>
                            {form.formState.errors.network && (
                                <p className="text-sm text-red-500">{form.formState.errors.network.message}</p>
                            )}
                        </div>
                        <div className={"space-y-2"}>
                            <Label className={"font-semibold"} htmlFor="phone">Phone Number</Label>
                            <Input id="phone" placeholder="e.g. 024XXXXXXX" {...form.register("phone")} />
                            {form.formState.errors.phone && (
                                <p className="text-sm text-red-500">{form.formState.errors.phone.message}</p>
                            )}
                        </div>
                        <div className={"space-y-2"}>
                            <Label className={"font-semibold"} htmlFor="amount">Amount</Label>
                            <Input id="amount" type="number" {...form.register("amount")} />
                            {form.formState.errors.amount && (
                                <p className="text-sm text-red-500">{form.formState.errors.amount.message}</p>
                            )}
                        </div>
                    </div>
                    <Button type="submit" className="w-full">
                        Continue
                    </Button>
                </form>
            </TabsContent>

            {/* Commission Deposit */}
            <TabsContent value="commission">
                <form onSubmit={commissionForm.handleSubmit(onCommissionSubmit)} className={"flex flex-col justify-between gap-4 min-h-80"}>
                    <div className={"space-y-4"}>
                        <p className="text-sm">
                            Commission Balance: <b>GHS {commissionBalance}</b>
                        </p>
                        <div className={"space-y-2"}>
                            <Label className={"font-semibold"} htmlFor="amount">Amount</Label>
                            <Input
                                id="amount"
                                type="number"
                                max={commissionBalance}
                                {...commissionForm.register("amount", {
                                    validate: (val) =>
                                        Number(val) <= commissionBalance || "Cannot exceed commission balance",
                                })}
                                disabled={commissionBalance < 50}
                            />
                            {commissionForm.formState.errors.amount && (
                                <p className="text-sm text-red-500">{commissionForm.formState.errors.amount.message}</p>
                            )}
                        </div>
                    </div>
                    <Button type="submit" disabled={commissionBalance < 50} className="w-full">
                        Continue
                    </Button>
                </form>
            </TabsContent>
        </Tabs>
    );
}

export default DepositForm;