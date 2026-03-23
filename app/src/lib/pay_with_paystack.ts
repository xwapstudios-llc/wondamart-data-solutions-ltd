declare global {
    interface Window {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        PaystackPop: any;
    }
}


export interface PaystackInitConfig {
    key: string; // public key
    email: string;
    amount: number; // in pesewas (GHS * 100)
    currency?: "GHS" | "NGN" | "USD" | string;
    reference?: string;

    metadata?: {
        custom_fields?: {
            display_name: string;
            variable_name: string;
            value: string;
        }[];
    };

    callback: (response: PaystackCallbackResponse) => void;
    onClose?: () => void;
}

export interface PaystackCallbackResponse {
    reference: string;
    status: "success" | "failed";
    trans?: string; // legacy
    transaction?: string; // legacy
    message?: string;
}

export function payWithPaystack(config: PaystackInitConfig) {
    if (typeof window === "undefined") return;

    if (!window.PaystackPop) {
        console.error(
            "PaystackPop is not available. Ensure the Paystack inline script is loaded before calling payWithPaystack."
        );
        return;
    }

    const handler = window.PaystackPop.setup({
        key: config.key,
        email: config.email,
        amount: config.amount,
        currency: config.currency ?? "GHC",
        reference: config.reference,
        metadata: config.metadata,

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        callback: (response: any) => {
            const callbackResponse: PaystackCallbackResponse = {
                reference: response.reference,
                status: response.status ?? "success",
                trans: response.trans ?? response.transaction,
                transaction: response.transaction ?? response.trans,
                message: response.message,
            };

            config.callback(callbackResponse);
        },

        onClose: config.onClose,
    });

    if (handler?.openIframe) {
        handler.openIframe();
    }

    return handler;
}

