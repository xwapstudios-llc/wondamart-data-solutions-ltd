import { createExpressApp, startServer, asyncHandler, ExpressAppConfig } from "@common-server/express";
import config from "@common-server/config";
import { api_key_middleware } from "@common-server/express/api_key_middleware";
import { origen_middleware } from "@common-server/express/origin_middleware";
import { home, paystackDeposit, paystackSubmitOTP, paystackCallback, paystackWebhook, sendDeposit, momoDeposit } from "./routes";
import express from "express";

const appConfig: ExpressAppConfig = {
    port: config.port_pay,
    host: config.host_server,
    name: "pay.wondamartgh.com",
    middleware: [origen_middleware],
    routes: [
        {
            path: "/",
            method: "GET" as const,
            handler: home
        },
        {
            path: "/deposit/paystack",
            method: "POST" as const,
            handler: asyncHandler(paystackDeposit),
            middleware: [api_key_middleware]
        },
        {
            path: "/deposit/paystack/submit-otp",
            method: "POST" as const,
            handler: asyncHandler(paystackSubmitOTP),
            middleware: [api_key_middleware]
        },
        {
            path: "/deposit/send",
            method: "POST" as const,
            handler: asyncHandler(sendDeposit),
            middleware: [api_key_middleware]
        },
        {
            path: "/deposit/momo",
            method: "POST" as const,
            handler: asyncHandler(momoDeposit),
            middleware: [api_key_middleware]
        },
        {
            path: "/callbacks/paystack",
            method: "POST" as const,
            handler: paystackCallback,
            middleware: [express.raw({ type: "*/*" })]
        },
        {
            path: "/webhooks/paystack",
            method: "POST" as const,
            handler: asyncHandler(paystackWebhook),
            middleware: [express.raw({ type: "*/*" })]
        }
    ]
};

const app = createExpressApp(appConfig);
startServer(app, appConfig);
