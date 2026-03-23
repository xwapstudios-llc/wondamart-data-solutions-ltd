import {RouteConfig, RouteHandler, sendResponse} from "@common-server/express";
import { Request } from "express";
import crypto from "crypto";
import config from "@common-server/config";
import {httpResponse} from "@common/types/request";
import {TxFn} from "@common-server/fn/tx/tx-fn";
import {UserFn} from "@common-server/fn/user-fn";
import {HendyLinksWebhookPayload} from "@common-server/providers/hendy-links/api";

/**
 * Validates the HendyLinks Webhook Signature
 * @param {Object} req - The Express request object
 * @returns {Boolean} - True if authenticated
 */
const verifyHendyLinksSignature = (req: Request) => {
    const signature = req.headers['x-webhook-signature'] as string;
    const apiToken = config.hendylinks_api_key;

    if (!signature || !apiToken) {
        return false;
    }

    // Generate the HMAC SHA256 hash from the raw body
    const hmac = crypto.createHmac('sha256', apiToken);
    const hash = hmac.update((req as any).rawBody).digest('hex');

    const expectedSignature = `sha256=${hash}`;

    return crypto.timingSafeEqual(
        Buffer.from(signature, 'utf8'),
        Buffer.from(expectedSignature, 'utf8')
    );
};

export const handler: RouteHandler = async (req, res) => {
    console.log("Received Hendylinks webhook ------------------------------------");
    console.log(JSON.stringify(req.body, null, 2));
    console.log("------------------------------------");

    if (!verifyHendyLinksSignature(req)) {
        console.warn("Invalid hendylinks signature");
        return sendResponse(res, {
            status: "error",
            code: 400,
            message: "Invalid signature",
        });
    }

    const data = req.body as HendyLinksWebhookPayload;

    if (data.event == "webhook.test") {
        console.warn("Hendylinks test event");
        return sendResponse(res, {
            status: "ok",
            code: 200,
            message: "Test received",
            data: data.event
        });
    }

    if (data.event !== "order.status_changed") {
        console.warn("Invalid hendylinks event");
        return sendResponse(res, {
            status: "error",
            code: 400,
            message: "Invalid event",
            data: data.event
        });
    }

    const order = data.order;
    const tx = await TxFn.readHendyLinksData(data.order.id.toString());

    if (!tx) {
        console.error("Transaction not found for Hendylinks reference:", data.order.id);
        console.log(data);
        return sendResponse(res, {
            status: "error",
            code: 400,
            message: "Transaction not found",
            data: data.order.id
        });
    }
    TxFn.addExtraData(tx.txId, data)

    if (order.status && order.status == "completed") {
        await TxFn.update_status_success(tx.txId);
    } else if (order.status && order.status == "failed") {
        await TxFn.update_status_failed(tx.txId);
        await UserFn.update_add_UserBalance(tx.agentId, tx.amount);
    } else {
        console.log("Unknown order status => ", order.status);
    }
    // TxWatcher.removeFromWatch(order.order_id);

    console.log("Processed Hendylinks webhook for reference:", order.id);
    return sendResponse(res, httpResponse("ok", "Processed successfully.", {
        reference: order.id
    }));
};

const hendylinksWebhook : RouteConfig = {
    path: "/hendylinks",
    post: handler,
}
export default hendylinksWebhook;