export interface CommonAFA {
    unitPrice: number;
    commission: number;
    enabled: boolean;
}
export interface CommonResultChecker {
    unitPrice: number;
    commission: number;
    enabled: boolean;
}
export interface CommonUserRegistration {
    unitPrice: number;
    commission: number;
    enabled: boolean;
}
interface CommonPaymentMethod {
    name: string;
    details: string;
    enabled: boolean;
}
export interface CommonPaymentMethods {
    paystack: CommonPaymentMethod;
    send: CommonPaymentMethod;
    momo: CommonPaymentMethod;
}

export type DataBundleProvider = "datamart" | "hendylinks" | "wondamart";
export interface CommonDataBundles {
    enabled: boolean;
    mtn: {
        enabled: boolean;
    },
    telecel: {
        enabled: boolean;
    },
    airteltigo: {
        enabled: boolean;
    },
    provider: DataBundleProvider;
}
export interface CommonSettings {
    afa: CommonAFA,
    resultChecker: CommonResultChecker,
    userRegistration: CommonUserRegistration,
    paymentMethods: CommonPaymentMethods,
    dataBundles: CommonDataBundles,
}

export const initialCommonSettings: CommonSettings = {
    afa: {
        unitPrice: 0,
        commission: 0,
        enabled: true,
    },
    resultChecker: {
        unitPrice: 0,
        commission: 0,
        enabled: true,
    },
    userRegistration: {
        unitPrice: 0,
        commission: 0,
        enabled: true,
    },
    paymentMethods: {
        paystack: {
            name: "Paystack",
            details: "",
            enabled: true,
        },
        send: {
            name: "Send",
            details: "",
            enabled: true,
        },
        momo: {
            name: "MoMo",
            details: "",
            enabled: true,
        }
    },
    dataBundles: {
        provider: "hendylinks",
        enabled: true,
        mtn: {
            enabled: true
        },
        telecel: {
            enabled: true
        },
        airteltigo: {
            enabled: true
        }
    }
}

export type CommonDocs = "afa" | "user-registration" | "result-checker" | "payment-methods" | "data-bundles";
export const commonDoc = {
    afa: "afa" as CommonDocs,
    resultChecker: "result-checker" as CommonDocs,
    userRegistration: "user-registration" as CommonDocs,
    paymentMethods: "payment-methods" as CommonDocs,
    dataBundles: "data-bundles" as CommonDocs,
}