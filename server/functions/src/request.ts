import { TxDataBundleRequest } from "@common/types/data-bundle.js";
import { onCall } from "firebase-functions/v2/https";
import { httpResponse } from "@common/types/request.js";
import { ThrowCheck } from "./internals/throw-check-fn.js";
import {TxDataBundleFn} from "@common-server/fn/tx/tx-data-bundle-fn.js";
import {TxFn} from "@common-server/fn/tx/tx-fn.js";
import { UserFn } from "@common-server/fn/user-fn.js";
import {ServerFn} from "@common-server/fn/server/server-fn.js";
import {TxAfaBundleRequest} from "@common/types/afa-bundle.js";
import {TxAfaBundleFn} from "@common-server/fn/tx/tx-afa-bundle-fn.js";
import {TxResultCheckerRequest} from "@common/types/result-checker.js";
import {TxResultCheckerFn} from "@common-server/fn/tx/tx-result-checker-fn.js";

const requestDataBundlePurchase = onCall(async (event) => {
    // Check if the user is authenticated.
    if (!event.auth) {
        // Throwing an HttpsError so that the client gets a proper error message.
        throw httpResponse(
            "unauthenticated",
            "The function must be called while authenticated.",
        );
    }

    // Sanitize and validate the input data.
    let d = event.data as TxDataBundleRequest;

    // Do checks
    const check = new ThrowCheck(event.auth.uid);
    await check.init();
    check.isUser();
    check.isUserDisabled();
    check.isActivated();

    let balance_modified = false;
    const details = await TxDataBundleFn.createAndCommit(d);

    // Start processing
    await TxFn.update_status_processing(details.id);

    // Check balance
    await check.hasEnoughBalance(details.amount);
    console.log("Has enough balance passed");

    try {
        // Take money from account
        await UserFn.update_sub_UserBalance(details.uid, details.amount);
        balance_modified = true;

        // Send Purchase order to Server
        await ServerFn.notify("tx_db");

        await TxFn.update_status_completed(details.id); // Todo: remove;

        return httpResponse(
            "ok",
            "Data Bundle order placed successfully",
            details
        )
    } catch (e) {
        await TxFn.update_status_failed(details.id);
        // if Failed, refund money.
        if (balance_modified) await UserFn.update_add_UserBalance(details.uid, details.amount);

        // Notify server to cancel order if placed Server
        await ServerFn.notify("tx_db");

        throw httpResponse(
            "error",
            "Something went wrong while processing your order."
        )
    }
    // Confirm purchase and update TxStatus
    // Confirming means we need to watch the Tx for updates by admin
});
export default requestDataBundlePurchase

export const requestAFABundlePurchase = onCall(async (event) => {
    // Check if the user is authenticated.
    if (!event.auth) {
        // Throwing an HttpsError so that the client gets a proper error message.
        throw httpResponse(
            "unauthenticated",
            "The function must be called while authenticated.",
        );
    }

    // Sanitize and validate the input data.
    let d = event.data as TxAfaBundleRequest;

    // Do checks
    const check = new ThrowCheck(event.auth.uid);
    await check.init();
    check.isUser();
    check.isUserDisabled();
    check.isActivated();

    // Create TxDocument
    const details = await TxAfaBundleFn.createAndCommit(d);
    let balance_modified = false;

    // Start processing
    await TxFn.update_status_processing(details.id);

    // Check balance
    await check.hasEnoughBalance(details.amount);


    try {
        // Take money from account
        await UserFn.update_sub_UserBalance(details.uid, details.amount);
        balance_modified = true;

        // Send Purchase order to Server
        await ServerFn.notify("tx_af");

        await TxFn.update_status_completed(details.id); // Todo: remove;

        return httpResponse(
            "ok",
            "AFA Bundle order placed successfully",
            details
        )
    } catch (e) {
        await TxFn.update_status_failed(details.id);
        // if Failed, refund money.
        if (balance_modified) await UserFn.update_add_UserBalance(details.uid, details.amount);

        // Notify server to cancel order if placed
        await ServerFn.notify("tx_af");

        throw httpResponse(
            "error",
            "Something went wrong while processing your order."
        )
    }
    // Confirm purchase and update TxStatus
    // Confirming means we need to watch the Tx for updates by admin
});

export const requestResultCheckerPurchase = onCall(async (event) => {
    // Check if the user is authenticated.
    if (!event.auth) {
        // Throwing an HttpsError so that the client gets a proper error message.
        throw httpResponse(
            "unauthenticated",
            "The function must be called while authenticated.",
        );
    }

    // Sanitize and validate the input data.
    let d = event.data as TxResultCheckerRequest;

    // Do checks
    const check = new ThrowCheck(event.auth.uid);
    await check.init();
    check.isUser();
    check.isUserDisabled();
    check.isActivated();

    const details = await TxResultCheckerFn.createAndCommit(d);
    let balance_modified = false;

    // Start processing
    await TxFn.update_status_processing(details.id);

    // Check balance
    await check.hasEnoughBalance(details.amount);


    try {
        // Take money from account
        await UserFn.update_sub_UserBalance(details.uid, details.amount);
        balance_modified = true;

        // Send Purchase order to Server
        await ServerFn.notify("tx_db");

        await TxFn.update_status_completed(details.id); // Todo: remove;

        return httpResponse(
            "ok",
            "Result Checker order placed successfully",
            details
        )
    } catch (e) {
        await TxFn.update_status_failed(details.id);
        // if Failed, refund money.
        if (balance_modified) await UserFn.update_add_UserBalance(details.uid, details.amount);

        // Notify server to cancel order if placed
        await ServerFn.notify("tx_db");

        throw httpResponse(
            "error",
            "Something went wrong while processing your order."
        )
    }
    // Confirm purchase and update TxStatus
    // Confirming means we need to watch the Tx for updates by admin
});
