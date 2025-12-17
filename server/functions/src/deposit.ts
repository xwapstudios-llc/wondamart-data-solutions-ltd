import {HttpsError, onCall} from "firebase-functions/v2/https";
import {TxDepositMoMoRequest, TxDepositPaystackRequest, TxDepositSendRequest} from "@common/types/account-deposit.js";
import {ThrowCheck} from "./internals/throw-check-fn.js";
import {CommonSettingsFn} from "@common-server/fn/common-settings-fn.js";
import {TxAccountDepositFn} from "@common-server/fn/tx/tx-account-deposit-fn.js";
import {ServerFn} from "@common-server/fn/server/server-fn.js";

import axios from "axios";

export const requestDepositPaystack = onCall(async (event) => {
    // Check if the user is authenticated.
    if (!event.auth) {
        // Throwing an HttpsError so that the client gets a proper error message.
        throw new HttpsError(
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
    check.isActivated();

    // Read settings
    const paymentSettings = await CommonSettingsFn.read_paymentMethods();
    if (!paymentSettings.paystack.enabled) {
        throw new HttpsError(
            "aborted",
            "This payment method is no available at the moment."
        )
    }

    // if (!await ServerFn.isActive()) {
    //     throw new HttpsError(
    //         "aborted",
    //         "Payment server is currently not available."
    //     )
    // }

    // Start a transaction document
    await TxAccountDepositFn.createAndCommit.paystack(d);
    // Tell server to continue processing the deposit
    await ServerFn.notify("tx_dp_paystack");

    const client = axios.create({
        baseURL: "https://api.wondamartgh.com",
        timeout: 15000,
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
    });

    const response = await client.post(
        "/deposti/paystack",
        d
    );
    if (response.status === 500) {
        return response;
    } else {
        return {
            statusCode: response.status,
        };
    }
});

export const requestDepositSend = onCall(async (event) => {
    // Check if the user is authenticated.
    if (!event.auth) {
        // Throwing an HttpsError so that the client gets a proper error message.
        throw new HttpsError(
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
    check.isActivated();

    // Read settings
    const paymentSettings = await CommonSettingsFn.read_paymentMethods();
    if (!paymentSettings.send.enabled) {
        throw new HttpsError(
            "aborted",
            "This payment method is no available at the moment."
        )
    }

    // if (!await ServerFn.isActive()) {
    //     throw new HttpsError(
    //         "aborted",
    //         "Payment server is currently not available."
    //     )
    // }

    // Start a transaction document
    await TxAccountDepositFn.createAndCommit.send(d);
    // Tell server to continue processing the deposit
});

export const requestDepositMoMo = onCall(async (event) => {
    // Check if the user is authenticated.
    if (!event.auth) {
        // Throwing an HttpsError so that the client gets a proper error message.
        throw new HttpsError(
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
    check.isActivated();

    // Read settings
    const paymentSettings = await CommonSettingsFn.read_paymentMethods();
    if (!paymentSettings.momo.enabled) {
        throw new HttpsError(
            "aborted",
            "This payment method is no available at the moment."
        )
    }

    // if (!await ServerFn.isActive()) {
    //     throw new HttpsError(
    //         "aborted",
    //         "Payment server is currently not available."
    //     )
    // }

    // Start a transaction document
    await TxAccountDepositFn.createAndCommit.momo(d);
    // Tell server to continue processing the deposit
});
