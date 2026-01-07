import paystackCallback from "@/routes/callback/paystack";
import {RouteConfig} from "@common-server/express";

const callbacks : RouteConfig = {
    path: "/callbacks",
    middleware: [],
    children: [
        paystackCallback
    ]
};

export default callbacks;