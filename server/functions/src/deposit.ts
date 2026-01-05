import {onCall} from "firebase-functions/v2/https";
import {
    TxDepositMoMoRequest,
    TxDepositPaystackRequest,
    TxDepositSendRequest,
    TxSubmitOTPRequest
} from "@common/types/account-deposit.js";
import {httpResponse} from "@common/types/request.js";
import {ThrowCheck} from "@common-server/fn/throw-check-fn.js";
import {CommonSettingsFn} from "@common-server/fn/common-settings-fn.js";
import {TxAccountDepositFn} from "@common-server/fn/tx/tx-account-deposit-fn.js";
import {ServerFn} from "@common-server/fn/server/server-fn.js";
import axios from "axios";
import {api_key} from "@common-server/utils/api_key.js";


async function pay_client() {
    return axios.create({
        baseURL: "https://pay.wondamartgh.com",
        timeout: 15000,
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "authorization": `Bearer ${api_key}`
        },
    });
}

export const requestSubmitOTP = onCall(async (event) => {
    // Check if the user is authenticated.
    if (!event.auth) {
        // Throwing an HttpsError so that the client gets a proper error message.
        throw httpResponse(
            "unauthenticated",
            "The function must be called while authenticated.",
        );
    }

    // Sanitize and validate the input data.
    let d = event.data as TxSubmitOTPRequest;

    // Do checks
    const check = new ThrowCheck(event.auth.uid);
    await check.init();
    check.isUser();
    check.isUserDisabled();
    // check.isActivated();

    // Read settings
    const paymentSettings = await CommonSettingsFn.read_paymentMethods();
    if (!paymentSettings.paystack.enabled) {
        throw httpResponse(
            "aborted",
            "This payment method is no available at the moment."
        )
    }
    const client = await pay_client();
    const response = await client.post(
        "/deposit/paystack/submit-otp",
        d
    );
    return response.data;
});

// export const requestResendOTP = onCall(async (event) => {
//     // Check if the user is authenticated.
//     if (!event.auth) {
//         // Throwing an HttpsError so that the client gets a proper error message.
//         throw httpResponse(
//             "unauthenticated",
//             "The function must be called while authenticated.",
//         );
//     }
//
//     // Sanitize and validate the input data.
//     let d = event.data as { txID: string };
//
//     // Do checks
//     const check = new ThrowCheck(event.auth.uid);
//     await check.init();
//     check.isUser();
//     check.isUserDisabled();
//     // check.isActivated();
//
//     // Read settings
//     const paymentSettings = await CommonSettingsFn.read_paymentMethods();
//     if (!paymentSettings.paystack.enabled) {
//         throw httpResponse(
//             "aborted",
//             "This payment method is no available at the moment."
//         )
//     }
//     const client =  await pay_client();
//     const response = await client.post(
//         "/deposit/paystack/resend-otp",
//         d
//     );
//     return response.data;
// });

export const requestDepositPaystack = onCall(async (event) => {
    // Check if the user is authenticated.
    if (!event.auth) {
        // Throwing an HttpsError so that the client gets a proper error message.
        throw httpResponse(
            "unauthenticated",
            "The function must be called while authenticated.",
        );
    }

    // Sanitize and validate the input data.
    let d = event.data as TxDepositPaystackRequest;


    // Do checks
    const check = new ThrowCheck(event.auth.uid);
    await check.init();
    check.isUser();
    check.isUserDisabled();
    // check.isActivated();

    // Read settings
    const paymentSettings = await CommonSettingsFn.read_paymentMethods();
    if (!paymentSettings.paystack.enabled) {
        throw httpResponse(
            "aborted",
            "This payment method is no available at the moment."
        )
    }

    // if (!await ServerFn.isActive()) {
    //     throw httpResponse(
    //         "aborted",
    //         "Payment server is currently not available."
    //     )
    // }

    // Start a transaction document
    const details = await TxAccountDepositFn.createAndCommit.paystack(d);
    // Tell server to continue processing the deposit
    await ServerFn.notify("tx_dp_paystack");

    const client = await pay_client();
    const response = await client.post(
        "/deposit/paystack",
        details
    );
    return response.data;
});

export const requestDepositSend = onCall(async (event) => {
    // Check if the user is authenticated.
    if (!event.auth) {
        // Throwing an HttpsError so that the client gets a proper error message.
        throw httpResponse(
            "unauthenticated",
            "The function must be called while authenticated.",
        );
    }

    // Sanitize and validate the input data.
    let d = event.data as TxDepositSendRequest;

    // Do checks
    const check = new ThrowCheck(event.auth.uid);
    await check.init();
    check.isUser();
    check.isUserDisabled();
    // check.isActivated();

    // Read settings
    const paymentSettings = await CommonSettingsFn.read_paymentMethods();
    if (!paymentSettings.send.enabled) {
        throw httpResponse(
            "aborted",
            "This payment method is no available at the moment."
        )
    }

    // if (!await ServerFn.isActive()) {
    //     throw httpResponse(
    //         "aborted",
    //         "Payment server is currently not available."
    //     )
    // }

    // Start a transaction document
    const details = await TxAccountDepositFn.createAndCommit.send(d);
    // Tell server to continue processing the deposit

    const client = await pay_client();
    const response = await client.post(
        "/deposit/send",
        details
    );
    if (response.status === 500) {
        return response;
    } else {
        return {
            statusCode: response.status,
        };
    }
});

export const requestDepositMoMo = onCall(async (event) => {
    // Check if the user is authenticated.
    if (!event.auth) {
        // Throwing an HttpsError so that the client gets a proper error message.
        throw httpResponse(
            "unauthenticated",
            "The function must be called while authenticated.",
        );
    }

    // Sanitize and validate the input data.
    let d = event.data as TxDepositMoMoRequest;


    // Do checks
    const check = new ThrowCheck(event.auth.uid);
    await check.init();
    check.isUser();
    check.isUserDisabled();
    // check.isActivated();

    // Read settings
    const paymentSettings = await CommonSettingsFn.read_paymentMethods();
    if (!paymentSettings.momo.enabled) {
        throw httpResponse(
            "aborted",
            "This payment method is no available at the moment."
        )
    }

    // if (!await ServerFn.isActive()) {
    //     throw httpResponse(
    //         "aborted",
    //         "Payment server is currently not available."
    //     )
    // }

    // Start a transaction document
    const details = await TxAccountDepositFn.createAndCommit.momo(d);
    // Tell server to continue processing the deposit

    const client = await pay_client();
    const response = await client.post(
        "/deposit/momo",
        details
    );
    if (response.status === 500) {
        return response;
    } else {
        return {
            statusCode: response.status,
        };
    }
});
