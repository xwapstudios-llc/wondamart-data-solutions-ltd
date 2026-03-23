import * as React from "react";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { Network } from "@common/data-bundle";
import type { AgentDataBundle } from "@common/agent";
import { type PaystackCallbackResponse, payWithPaystack } from "@/lib/pay_with_paystack.ts";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/cn/components/ui/button.tsx";
import Page from "@/ui/page/Page.tsx";
import PageContent from "@/ui/page/PageContent.tsx";
import { ArrowLeftIcon, CreditCardIcon, PackageIcon } from "lucide-react";
import { toast } from "sonner";
import {toCurrency} from "@/lib/icons.ts";

const networkName: Record<Network, string> = {
    mtn: "MTN",
    telecel: "Telecel",
    at: "AirtelTigo",
};

const checkoutSchema = z.object({
    phone: z
        .string()
        .min(1, "Mobile number is required")
        .regex(/^0[235][0-9]{8}$/, "Enter a valid Ghanaian mobile number (e.g. 0241234567)"),
    email: z
        .email("Enter a valid email address"),
});

type CheckoutForm = z.infer<typeof checkoutSchema>;

const AgentStoreCheckout: React.FC = () => {
    const navigate = useNavigate();
    const { state } = useLocation() as { state: { bundle: AgentDataBundle; network: Network } | null };

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<CheckoutForm>({
        resolver: zodResolver(checkoutSchema as never),
    });

    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://js.paystack.co/v1/inline.js";
        script.async = true;
        document.head.appendChild(script);
        return () => { document.head.removeChild(script); };
    }, []);

    if (!state?.bundle || !state?.network) {
        return (
            <Page className="pb-8">
                <PageContent className="max-w-4xl mx-auto space-y-4 pt-4">
                    <div className="rounded-xl border bg-card p-6">
                        <p className="text-muted-foreground">
                            No bundle selected. <button onClick={() => navigate(-1)} className="underline">Go back</button>
                        </p>
                    </div>
                </PageContent>
            </Page>
        );
    }

    const { bundle, network } = state;

    function paymentCallback(response: PaystackCallbackResponse): void {
        if (response.status === "success") {
            toast.success("Payment successful!", {
                description: `Reference: ${response.reference}`,
                duration: 8000,
            });
        } else {
            toast.error("Payment was not completed.", {
                description: `Status: ${response.status} · Ref: ${response.reference}`,
            });
        }
    }

    function userFinishedPayment(): void {
        toast.info("Payment window closed.");
    }

    const amount = Number(bundle.agentPrice) || 0;
    const processingFee = amount * 0.02;
    const total = amount + processingFee;

    const onSubmit = (data: CheckoutForm) => {
        payWithPaystack({
            key: "pk_live_704d05b79ca60b777090991d8d5c2c6354346219",
            currency: "GHS",
            email: data.email,
            amount: total,
            callback: paymentCallback,
            onClose: userFinishedPayment,
            reference: "",
            metadata: {
                custom_fields: [
                    { display_name: "Mobile Number", variable_name: "mobile_number", value: data.phone },
                ],
            },
        });
    };

    return (
        <Page className="pb-8">
            <PageContent className="max-w-4xl mx-auto space-y-4 pt-4">
                <div className="rounded-xl border bg-card p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="flex size-9 items-center justify-center rounded-md bg-purple-500 text-white">
                            <PackageIcon className="size-4" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold">Checkout</p>
                            <p className="text-xs text-muted-foreground">Complete your purchase</p>
                        </div>
                    </div>
                    <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-muted-foreground hover:underline mb-4">
                        <ArrowLeftIcon className="size-4" />
                        Back
                    </button>

                    <div className="border rounded-md p-4 space-y-1 mb-6 bg-primary/25">
                        <p><span className="text-muted-foreground">Network:</span> {networkName[network]}</p>
                        <p><span className="text-muted-foreground">Bundle:</span> {bundle.dataPackage.data} MB</p>
                        <p><span className="text-muted-foreground">Validity:</span> {bundle.validity} days</p>
                        <p><span className="text-muted-foreground">Price:</span> <span className="font-bold">{toCurrency(bundle.agentPrice)}</span></p>
                    </div>

                    <div className="flex items-center gap-3 mb-4">
                        <div className="flex size-9 items-center justify-center rounded-md bg-orange-500 text-white">
                            <CreditCardIcon className="size-4" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold">Payment Details</p>
                            <p className="text-xs text-muted-foreground">Enter your information</p>
                        </div>
                    </div>
                    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-sm font-medium">Mobile Number</label>
                            <input
                                type="tel"
                                placeholder="e.g. 0241234567"
                                {...register("phone")}
                                className={`w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 ${
                                    errors.phone ? "border-red-500 focus:ring-red-400" : "focus:ring-ring"
                                }`}
                            />
                            {errors.phone && <p className="text-xs text-red-500">{errors.phone.message}</p>}
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium">Email</label>
                            <input
                                type="email"
                                placeholder="e.g. johndoe@example.com"
                                {...register("email")}
                                className={`w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 ${
                                    errors.email ? "border-red-500 focus:ring-red-400" : "focus:ring-ring"
                                }`}
                            />
                            {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
                        </div>

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


                        <Button
                            type="submit"
                            size={"lg"}
                            disabled={isSubmitting}
                            className="w-full transition"
                        >
                            Pay with Paystack
                        </Button>
                    </form>
                </div>
            </PageContent>
        </Page>
    );
};

export default AgentStoreCheckout;
