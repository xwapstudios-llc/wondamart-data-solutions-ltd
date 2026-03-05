import {RouteConfig, RouteHandler, sendResponse} from "@common-server/express";
import crypto from "crypto";
import config from "@common-server/config";
import {httpResponse} from "@common/types/request";
import {TxFn} from "@common-server/fn/tx/tx-fn";
import {UserFn} from "@common-server/fn/user-fn";
import {HendyLinksWebhookPayload} from "@common-server/providers/hendy-links/api";

export const handler: RouteHandler = async (req, res) => {
    const signature = req.headers['x-webhook-signature'] as string;

    console.log("Received Hendylinks webhook ------------------------------------");
    console.log(JSON.stringify(req.body, null, 2));
    console.log("------------------------------------");

    const hmac = crypto.createHmac("sha256", config.hendylinks_api_key);
    const digest = Buffer.from(hmac.update((req as any).rawBody).digest('hex'), 'utf8');
    const checksum = Buffer.from(signature, 'utf8');

    if (crypto.timingSafeEqual(digest, checksum)) {
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
    TxFn.addExtraData(tx.id, data)

    if (order.status && order.status == "completed") {
        await TxFn.update_status_completed(tx.id);
    } else if (order.status && order.status == "failed") {
        await TxFn.update_status_failed(tx.id);
        await UserFn.update_add_UserBalance(tx.uid, tx.amount);
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