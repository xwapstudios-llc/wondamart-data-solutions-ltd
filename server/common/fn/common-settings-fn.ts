import {commonSettingsCollections} from "./collections";
import {CommonSettings} from "@common/types/common-settings";

const CommonSettingsFn = {
    read: async () => {
        const docRef = commonSettingsCollections.doc("all");
        const settings = await docRef.get();
        if (!settings.exists) {
            return null;
        }
        return settings.data() as CommonSettings;
    },
    read_afa: async () => {
        const all = await CommonSettingsFn.read();
        return all?.afa
    },
    read_resultChecker: async () => {
        const all = await CommonSettingsFn.read();
        return all?.resultChecker
    },
    read_userRegistration: async () => {
        const all = await CommonSettingsFn.read();
        return all?.userRegistration
    },
    read_paymentMethods: async () => {
        const all = await CommonSettingsFn.read();
        return all?.paymentMethods
    },
    read_dataBundles: async () => {
        const all = await CommonSettingsFn.read();
        return all?.dataBundles
    },
    create: async (obj: CommonSettings) => {
        const docRef = commonSettingsCollections.doc("all");
        await docRef.set({
            ...obj
        }, {merge: true});
    },
    init: async () => {
        // Initialize the settings documents
        const all: CommonSettings = {
            afa: {
                unitPrice: 17,
                commission: 0.5,
                enabled: true,
            },
            resultChecker: {
                unitPrice: 18,
                commission: 0.2,
                enabled: true,
            },
            userRegistration: {
                unitPrice: 20,
                commission: 2,
                enabled: true,
            },
            paymentMethods: {
                paystack: {
                    name: "Paystack",
                    enabled: true,
                    details: "This payment method goes to paystack and may attract charges."
                },
                send: {
                    name: "Send",
                    enabled: false,
                    details: "This payment method requires user to send money and then claim with the transaction id."
                },
                momo: {
                    name: "MoMo",
                    enabled: false,
                    details: "This payment method allows user to deposit by allowing cash out and confirming the transaction."
                }
            },
            dataBundles: {
                provider: "hendylinks",
                enabled: true,
                mtn: {
                    enabled: true,
                },
                telecel: {
                    enabled: true,
                },
                airteltigo: {
                    enabled: true,
                },
            }
        }
        await CommonSettingsFn.create(all);
    },
}

export {
    CommonSettingsFn,
}