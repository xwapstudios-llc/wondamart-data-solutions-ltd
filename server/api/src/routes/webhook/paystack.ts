import {RouteConfig, RouteHandler, sendResponse} from "@common-server/express";
import crypto from "crypto";
import config from "@common-server/config";
import {httpResponse} from "@common/types/request";
import {TxFn} from "@common-server/fn/tx/tx-fn";
import {currency_to_paystack_amount} from "@/paystack/charge";
import {UserFn} from "@common-server/fn/user-fn";
import {TxWatcher} from "@common-server/fn/tx/tx-watcher";
import {mnotifyClient} from "@common-server/providers/mnotify/api";
import {TxDepositPaystackData} from "@common/types/account-deposit";
import {Request} from "express";

const verifyPaystackSignature = (req: Request) => {
    const signature = req.headers["x-paystack-signature"] as string;
    const apiToken = config.paystack_production_key;
    if (!signature || !apiToken) return false;
    const hmac = crypto.createHmac('sha256', apiToken);
    const hash = hmac.update((req as any).rawBody).digest('hex');
    return crypto.timingSafeEqual(
        Buffer.from(signature, 'utf8'),
        Buffer.from(`sha256=${hash}`, 'utf8')
    );
};

export const handler: RouteHandler = async (req, res) => {
    if (!verifyPaystackSignature(req)) {
        return sendResponse(res, { status: "error", code: 400, message: "Invalid signature" });
    }

    const event = req.body;
    if (event.event !== "charge.success") {
        return sendResponse(res, httpResponse("aborted", "Event type not supported.", { event: event.event }));
    }

    const {reference, amount, status, fees} = event.data;
    if (status != "success") {
        return sendResponse(res, httpResponse("rejected", "Payment not successful.", { reference }));
    }

    const tx = await TxFn.read(reference);
    const received_amount = amount - (fees || 0);
    if (received_amount < currency_to_paystack_amount(tx!.amount)) {
        return sendResponse(res, httpResponse("aborted", JSON.stringify({
            reference,
            expected_amount: tx!.amount,
            received_amount,
            message: "Received amount is less than expected amount.",
        })));
    }

    if (!tx || tx.status === "success") {
        return sendResponse(res, httpResponse("aborted", "Transaction already processed.", { reference }));
    }

    await TxFn.update_status_success(reference);
    await UserFn.update_add_UserBalance(tx.agentId, tx.amount);
    TxWatcher.removeFromWatch(reference);

    const data = tx.txData as TxDepositPaystackData;
    mnotifyClient.sendSms({
        recipients: [data.phoneNumber],
        message: `Your deposit of ${tx.amount} was successful. Thank you for using Wondamart Data Solutions.`
    }).catch(err => console.error("Failed to send SMS notification:", err));

    return sendResponse(res, httpResponse("ok", "Payment processed successfully.", { reference }));
};

const paystackWebhook: RouteConfig = {
    path: "/paystack",
    post: handler,
};
export default paystackWebhook;
