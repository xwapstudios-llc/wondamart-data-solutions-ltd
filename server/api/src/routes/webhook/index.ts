import hendylinksWebhook from "@/routes/webhook/hendylinks";
import paystackWebhook from "@/routes/webhook/paystack";
import {notFoundHandler, RouteConfig} from "@common-server/express";

const webhooks: RouteConfig = {
    path: "/webhooks",
    middleware: [],
    children: [
        hendylinksWebhook,
        paystackWebhook
    ]
};

export default webhooks;