import { RouteHandler, sendResponse } from "@common-server/express";
import { TxDepositPaystackRequest, TxSubmitOTPRequest, TxDepositSendRequest, TxDepositMoMoRequest } from "@common/types/account-deposit";
import { test_paystack } from "@/paystack";
import { charge, currency_to_paystack_amount, networkID_to_paystack_provider } from "@/paystack/charge";
import { TxFn } from "@common-server/fn/tx/tx-fn";
import { httpResponse } from "@common/types/request";
import { ThrowCheck } from "@common-server/fn/throw-check-fn";
import { CommonSettingsFn } from "@common-server/fn/common-settings-fn";
import { TxAccountDepositFn } from "@common-server/fn/tx/tx-account-deposit-fn";
import { TxWatcher } from "@common-server/fn/tx/tx-watcher";

export const paystackDeposit: RouteHandler = async (req, res) => {
    const uid = req.userId!;
    const d = req.body as Omit<TxDepositPaystackRequest, 'uid'>;

    console.log("Received: deposit > ", d);
    
    const check = new ThrowCheck(res, uid);
    if (!await check.init()) return;
    if (!check.isUser()) return;
    if (!check.isUserDisabled()) return;

    console.log("Finished throw checks");

    const paymentSettings = await CommonSettingsFn.read_paymentMethods();
    if (!paymentSettings.paystack.enabled) {
        return sendResponse(res, httpResponse("aborted", "This payment method is no available at the moment."));
    }

    console.log("Finished payment method checks");
    
    const tx = await TxAccountDepositFn.createAndCommit.paystack({ ...d, uid });
    console.log("Finished creating tx > ", tx);

    if (!tx?.id || !tx?.amount || !tx?.uid) {
        return sendResponse(res, httpResponse("invalid-data", {
            title: "Invalid data in request",
            message: "Request expected a valid transaction id, an amount and a valid user id.",
        }));
    }

    console.log("Received tx for Paystack:", tx);

    try {
        await TxFn.update_status_processing(tx.id);
        
        // Add transaction to watcher for auto-fail after 5 minutes
        TxWatcher.addToWatch(tx.id, 5);

        const data = tx.data as any;
        const response = await test_paystack({
            amount: currency_to_paystack_amount(tx.amount) * 1.02,
            currency: "GHS",
            email: data.email,
            mobile_money: {
                phone: data.phoneNumber,
                provider: networkID_to_paystack_provider(data.network),
            },
            reference: tx.id,
        });

        return sendResponse(res, response);
    } catch (err: unknown) {
        console.error("Paystack init failed:", err);
        await TxFn.update_status_failed(tx.id);
        TxWatcher.removeFromWatch(tx.id); // Remove from watcher if failed immediately
        return sendResponse(res, httpResponse("error", {
            title: "Paystack Error",
            message: `An unexpected error happened while requesting a charge to paystack. Please contact admin for support. ${err}`
        }));
    }
};

export const paystackSubmitOTP: RouteHandler = async (req, res) => {
    const uid = req.userId!;
    const d = req.body as Omit<TxSubmitOTPRequest, 'uid'>;

    const check = new ThrowCheck(res, uid);
    if (!await check.init()) return;
    if (!check.isUser()) return;
    if (!check.isUserDisabled()) return;

    const paymentSettings = await CommonSettingsFn.read_paymentMethods();
    if (!paymentSettings.paystack.enabled) {
        return sendResponse(res, httpResponse("aborted", "This payment method is no available at the moment."));
    }

    const { txID, otp } = d;

    console.log("-----------------------------------------------");
    console.log("paystack/submit-otp data:", req.body);
    console.log("-----------------------------------------------");
    
    if (!txID || !otp) {
        return sendResponse(res, httpResponse("invalid-data", {
            title: "Invalid data in request",
            message: "Request expected a valid transaction reference and an otp.",
        }));
    }

    try {
        console.log(`Received OTP submission for reference ${txID}: ${otp}`);
        const response = await charge.submit_otp(txID, otp);

        if (response.error) {
            return sendResponse(res, httpResponse("error", {
                title: "Failed to submit OTP",
                message: `An error occurred while submitting the OTP: ${response.error}`,
            }));
        }
        
        return sendResponse(res, httpResponse("ok", "OTP submitted successfully."));
    } catch (err: unknown) {
        console.error("Paystack OTP submission failed:", err);
        return sendResponse(res, httpResponse("error", {
            title: "Paystack OTP Error",
            message: `An error occurred while submitting the OTP: ${err}`,
        }));
    }
};

export const sendDeposit: RouteHandler = async (req, res) => {
    const uid = req.userId!;
    const d = req.body as Omit<TxDepositSendRequest, 'uid'>;

    const check = new ThrowCheck(res, uid);
    if (!await check.init()) return;
    if (!check.isUser()) return;
    if (!check.isUserDisabled()) return;

    const paymentSettings = await CommonSettingsFn.read_paymentMethods();
    if (!paymentSettings.send.enabled) {
        return sendResponse(res, httpResponse("aborted", "This payment method is not available at the moment."));
    }

    // const tx = await TxAccountDepositFn.createAndCommit.send(d);
    
    // TODO: Implement Send deposit logic
    return sendResponse(res, httpResponse("rejected", "Send deposit not implemented yet"));
};

export const momoDeposit: RouteHandler = async (req, res) => {
    const uid = req.userId!;
    const d = req.body as Omit<TxDepositMoMoRequest, 'uid'>;

    const check = new ThrowCheck(res, uid);
    if (!await check.init()) return;
    if (!check.isUser()) return;
    if (!check.isUserDisabled()) return;

    const paymentSettings = await CommonSettingsFn.read_paymentMethods();
    if (!paymentSettings.momo.enabled) {
        return sendResponse(res, httpResponse("aborted", "This payment method is not available at the moment."));
    }

    // const tx = await TxAccountDepositFn.createAndCommit.momo(d);
    
    // TODO: Implement MoMo deposit logic
    return sendResponse(res, httpResponse("rejected", "MoMo deposit not implemented yet"));
};