import {
    CommonAFA,
    CommonDataBundles,
    commonDoc,
    CommonDocs,
    CommonPaymentMethods,
    CommonResultChecker, CommonSettings,
    CommonUserRegistration
} from "@common/types/common-settings";
import {collections, db} from "@common/lib/db"
import {getDoc, doc} from "firebase/firestore";

const ClCommonSettings = {
    read: async (ref: CommonDocs) => {
        const settings = await getDoc(doc(db, collections.commonSettings, ref));
        if (!settings.exists) {
            return null;
        }
        return settings.data() as Object;
    },
    read_afa: async () => {
        return await ClCommonSettings.read(commonDoc.afa) as CommonAFA;
    },
    read_resultChecker: async () => {
        return await ClCommonSettings.read(commonDoc.resultChecker) as CommonResultChecker;
    },
    read_userRegistration: async () => {
        return await ClCommonSettings.read(commonDoc.userRegistration) as CommonUserRegistration;
    },
    read_paymentMethods: async () => {
        return await ClCommonSettings.read(commonDoc.paymentMethods) as CommonPaymentMethods;
    },
    read_dataBundles: async () => {
        return await ClCommonSettings.read(commonDoc.dataBundles) as CommonDataBundles;
    },
    read_all: async (): Promise<CommonSettings> => {
        return {
            afa: await ClCommonSettings.read_afa(),
            resultChecker: await ClCommonSettings.read_resultChecker(),
            userRegistration: await ClCommonSettings.read_userRegistration(),
            paymentMethods: await ClCommonSettings.read_paymentMethods(),
            dataBundles: await ClCommonSettings.read_dataBundles(),
        }
    }
}

export {
    ClCommonSettings,
}