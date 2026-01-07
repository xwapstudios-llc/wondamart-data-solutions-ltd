import {RouteConfig, RouteHandler, sendResponse} from "@common-server/express";
import crypto from "crypto";
import config from "@common-server/config";
import {httpResponse} from "@common/types/request";
import {TxFn} from "@common-server/fn/tx/tx-fn";
import {UserFn} from "@common-server/fn/user-fn";

export const handler: RouteHandler = async (req, res) => {
    const signature = req.headers["X-Webhook-Signature"] as string;

    console.log("Received Hendylinks webhook ------------------------------------");
    console.log(JSON.stringify(req.body, null, 2));
    console.log("------------------------------------");

    const hash = crypto
        .createHmac("sha512", config.hendylinks_api_key)
        .update(req.body)
        .digest("hex");

    if (hash !== signature) {
        console.warn("Invalid hendylinks signature");
        return sendResponse(res, {
            status: "error",
            code: 400,
            message: "Invalid signature",
        });
    }

    const {event, order} = req.body;

    if (event !== "order.status_changed") {
        return sendResponse(res, httpResponse("aborted", "Event type not supported.", {
            event: event
        }));
    }

    if (order.status && order.status == "completed") {
        await TxFn.update_status_completed(order.id);
    } else if (order.status && order.status == "failed") {
        await TxFn.update_status_failed(order.id);
        await UserFn.update_add_UserBalance(order.uid, order.amount);
    } else {
        console.log("Unknown order status => ", order.status);
    }
    // TxWatcher.removeFromWatch(order.order_id);

    console.log("Processed Hendylinks webhook for reference:", order.order_id);
    return sendResponse(res, httpResponse("ok", "Processed successfully.", {
        reference: order.order_id
    }));
};

const hendylinksWebhook : RouteConfig = {
    path: "/hendylinks",
    post: handler,
}
export default hendylinksWebhook;