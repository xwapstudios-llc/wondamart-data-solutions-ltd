"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Functions = void 0;
const functions_1 = require("firebase/functions");
const app_1 = __importDefault(require("@common/lib/app"));
const fn = (0, functions_1.getFunctions)(app_1.default);
// if (process.env["NODE_ENV"] === "development") {
//     connectFunctionsEmulator(fn, "localhost", 5001);
// }
const Functions = {
    User: {
        create: (0, functions_1.httpsCallable)(fn, "createUser"),
        registerNewAgent: (0, functions_1.httpsCallable)(fn, "registerNewAgent"),
        updatePhoneNumber: (0, functions_1.httpsCallable)(fn, "updateUserPhoneNumber"),
        requestDelete: (0, functions_1.httpsCallable)(fn, "requestDeleteUser"),
        requestActivateAccount: (0, functions_1.httpsCallable)(fn, "requestActivateAccount"),
        requestEmailVerification: (0, functions_1.httpsCallable)(fn, "requestEmailVerification"),
    },
    admin: {
        requestFirstAdmin: (0, functions_1.httpsCallable)(fn, "requestFirstAdmin"),
        makeAdmin: (0, functions_1.httpsCallable)(fn, "requestMakeAdmin"),
        updateAdmin: (0, functions_1.httpsCallable)(fn, "requestUpdateAdmin"),
        revokeAdmin: (0, functions_1.httpsCallable)(fn, "requestRevokeAdmin"),
    },
    commonSettings: {
        init: (0, functions_1.httpsCallable)(fn, "initCommonSettings"),
    },
    Request: {
        DataBundle: (0, functions_1.httpsCallable)(fn, "requestDataBundlePurchase"),
        AFABundle: (0, functions_1.httpsCallable)(fn, "requestAFABundlePurchase"),
        ResultChecker: (0, functions_1.httpsCallable)(fn, "requestResultCheckerPurchase"),
        deposit: {
            paystack: (0, functions_1.httpsCallable)(fn, "requestDepositPaystack"),
            send: (0, functions_1.httpsCallable)(fn, "requestDepositSend"),
            momo: (0, functions_1.httpsCallable)(fn, "requestDepositMoMo"),
        },
    },
    DataBundle: {
        create: (0, functions_1.httpsCallable)(fn, "createDataBundle"),
        delete: (0, functions_1.httpsCallable)(fn, "deleteDataBundle"),
    }
};
exports.Functions = Functions;
//# sourceMappingURL=fn.js.map