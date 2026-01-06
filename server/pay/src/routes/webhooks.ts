import { RouteHandler, sendResponse } from "@common-server/express";
import { httpResponse } from "@common/types/request";
import { TxFn } from "@common-server/fn/tx/tx-fn";
import { UserFn } from "@common-server/fn/user-fn";
import { currency_to_paystack_amount } from "@/paystack/charge";
import crypto from "crypto";

export const paystackCallback: RouteHandler = async (req, res) => {
    console.log("Received Paystack callback ------------------------------------");
    console.log(JSON.stringify(req.body, null, 2));
    console.log("------------------------------------");

    res.sendStatus(200);
};

export const paystackWebhook: RouteHandler = async (req, res) => {
    const signature = req.headers["x-paystack-signature"] as string;

    console.log("Received Paystack webhook ------------------------------------");
    console.log(JSON.stringify(req.body, null, 2));
    console.log("------------------------------------");

    const hash = crypto
        .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY!)
        .update(req.body)
        .digest("hex");

    if (hash !== signature) {
        console.warn("Invalid Paystack signature");
        return sendResponse(res, {
            status: "error",
            code: 400,
            message: "Invalid signature",
        });
    }

    const event = req.body;

    if (event.event !== "charge.success") {
        return sendResponse(res, httpResponse("aborted", "Event type not supported.", {
            event: event.event
        }));
    }

    const { reference, amount, status, fees } = event.data;

    if (status != "success") {
        return sendResponse(res, httpResponse("rejected", "Payment not successful.", {
            reference: reference
        }));
    }

    const tx = await TxFn.read(reference);

    const received_amount = amount - (fees || 0);
    if (received_amount < currency_to_paystack_amount(tx!.amount)) {
        return sendResponse(res, httpResponse("aborted", JSON.stringify({
            reference: reference,
            expected_amount: tx!.amount,
            received_amount: received_amount,
            message: "Received amount is less than expected amount.",
        })));
    }

    if (!tx || tx.status === "completed") {
        return sendResponse(res, httpResponse("aborted", "Transaction already processed.", {
            reference: reference
        }));
    }

    await TxFn.update_status_completed(reference);
    await UserFn.update_add_UserBalance(tx.uid, tx.amount);

    console.log("Processed Paystack payment for reference:", reference);
    return sendResponse(res, httpResponse("ok", "Payment processed successfully.", {
        reference: reference
    }));
};