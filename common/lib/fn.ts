import {
    getFunctions,
    httpsCallable,
    // connectFunctionsEmulator
} from "firebase/functions";
import app from "@common/lib/app";

const fn = getFunctions(app);
// if (process.env["NODE_ENV"] === "development") {
//     connectFunctionsEmulator(fn, "localhost", 5001);
// }

const Functions = {
    User: {
        create: httpsCallable(fn, "createUser"),
        registerNewAgent: httpsCallable(fn, "registerNewAgent"),

        updatePhoneNumber: httpsCallable(fn, "updateUserPhoneNumber"),
        requestDelete: httpsCallable(fn, "requestDeleteUser"),

        requestActivateAccount: httpsCallable(fn, "requestActivateAccount"),
        requestEmailVerification: httpsCallable(fn, "requestEmailVerification"),
    },
    admin: {
        requestFirstAdmin: httpsCallable(fn, "requestFirstAdmin"),
        makeAdmin: httpsCallable(fn, "requestMakeAdmin"),
        updateAdmin: httpsCallable(fn, "requestUpdateAdmin"),
        revokeAdmin: httpsCallable(fn, "requestRevokeAdmin"),
    },
    commonSettings: {
        init: httpsCallable(fn, "initCommonSettings"),
    },
    Request: {
        DataBundle: httpsCallable(fn, "requestDataBundlePurchase"),
        AFABundle: httpsCallable(fn, "requestAFABundlePurchase"),
        ResultChecker: httpsCallable(fn, "requestResultCheckerPurchase"),

        deposit: {
            paystack: httpsCallable(fn, "requestDepositPaystack"),
            send: httpsCallable(fn, "requestDepositSend"),
            momo: httpsCallable(fn, "requestDepositMoMo"),
        },
        otp: {
            submit: httpsCallable(fn, "requestSubmitOTP"),
            resend: httpsCallable(fn, "requestResendOTP"),
        }
    },
    DataBundle: {
        create: httpsCallable(fn, "createDataBundle"),
        delete: httpsCallable(fn, "deleteDataBundle"),
    }
}

export {Functions};