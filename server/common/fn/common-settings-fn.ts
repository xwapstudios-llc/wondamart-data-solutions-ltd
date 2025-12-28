import {commonSettingsCollections} from "./collections";
import {
    CommonAFA,
    CommonDataBundles,
    commonDoc,
    CommonDocs,
    CommonPaymentMethods,
    CommonResultChecker,
    CommonUserRegistration
} from "@common/types/common-settings";

const CommonSettingsFn = {
    read: async (doc: CommonDocs) => {
        const docRef = commonSettingsCollections.doc(doc);
        const settings = await docRef.get();
        if (!settings.exists) {
            return null;
        }
        return settings.data() as Object;
    },
    read_afa: async () => {
        return await CommonSettingsFn.read(commonDoc.afa) as CommonAFA;
    },
    read_resultChecker: async () => {
        return await CommonSettingsFn.read(commonDoc.resultChecker) as CommonResultChecker;
    },
    read_userRegistration: async () => {
        return await CommonSettingsFn.read(commonDoc.userRegistration) as CommonUserRegistration;
    },
    read_paymentMethods: async () => {
        return await CommonSettingsFn.read(commonDoc.paymentMethods) as CommonPaymentMethods;
    },

    read_dataBundles: async () => {
        return await CommonSettingsFn.read(commonDoc.dataBundles) as CommonDataBundles;
    },

    create: async (ref: CommonDocs, obj: any) => {
        const docRef = commonSettingsCollections.doc(ref);
        await docRef.set({
            ...obj
        }, {merge: true});
    },
    init: async () => {
        // Initialize the settings documents
        const afa: CommonAFA = {
            unitPrice: 17,
            commission: 0.5,
            enabled: true,
        }
        const resultChecker: CommonResultChecker = {
            unitPrice: 18,
            commission: 0.2,
            enabled: true,
        }
        const userReg: CommonUserRegistration = {
            unitPrice: 20,
            commission: 2,
            enabled: true,
        }
        const paymentMethods: CommonPaymentMethods = {
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
        }
        const dataBundles: CommonDataBundles = {
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
        await CommonSettingsFn.create(commonDoc.afa, afa);
        await CommonSettingsFn.create(commonDoc.resultChecker, resultChecker);
        await CommonSettingsFn.create(commonDoc.userRegistration, userReg);
        await CommonSettingsFn.create(commonDoc.paymentMethods, paymentMethods);
        await CommonSettingsFn.create(commonDoc.dataBundles, dataBundles);
    },
}

export {
    CommonSettingsFn,
}