import {createExpressApp, startServer, asyncHandler, ExpressAppConfig, notFoundHandler} from "@common-server/express";
import config from "@common-server/config";
import { home, buyDataBundle, buyAfaBundle, buyResultChecker,
    createUser, registerNewAgent, requestActivateAccount, requestEmailVerification,
    updateUserPhoneNumber, requestDeleteUser, requestFirstAdmin, requestMakeAdmin,
    requestUpdateAdmin, requestRevokeAdmin, initCommonSettings, createDataBundle,
    deleteDataBundle, paystackDeposit, paystackSubmitOTP, paystackCallback, paystackWebhook, sendDeposit, momoDeposit } from "./routes";
import {api_middleware} from "@common-server/express/api_middleware";
import {user_middleware} from "@common-server/express/user_middleware";
import {admin_middleware} from "@common-server/express/admin_middleware";
import {origen_middleware} from "@common-server/express/origin_middleware";
import { TxWatcher } from "@common-server/fn/tx/tx-watcher";
import express from "express";

const appConfig: ExpressAppConfig = {
    port: config.port_api,
    host: config.host_server,
    name: "api.wondamartgh.com",
    middleware: [origen_middleware, api_middleware],
    routes: [
        {
            path: "/",
            method: "GET" as const,
            handler: home
        },
        {
            path: "/buy",
            method: "GET" as const,
            middleware: [user_middleware],
            handler: notFoundHandler,
            children: [
                {
                    path: "/buy/data-bundle",
                    method: "POST" as const,
                    handler: asyncHandler(buyDataBundle)
                },
                {
                    path: "/buy/afa-bundle",
                    method: "POST" as const,
                    handler: asyncHandler(buyAfaBundle)
                },
                {
                    path: "/buy/result-checker",
                    method: "POST" as const,
                    handler: asyncHandler(buyResultChecker)
                }
            ]
        },
        {
            path: "/new/user",
            method: "POST" as const,
            handler: asyncHandler(createUser)
        },
        {
            path: "/user",
            method: "GET" as const,
            handler: notFoundHandler,
            middleware: [user_middleware],
            children: [
                {
                    path: "/user/register-agent",
                    method: "POST" as const,
                    handler: asyncHandler(registerNewAgent),
                },
                {
                    path: "/user/activate",
                    method: "POST" as const,
                    handler: asyncHandler(requestActivateAccount),
                },
                {
                    path: "/user/verify-email",
                    method: "POST" as const,
                    handler: asyncHandler(requestEmailVerification),
                },
                {
                    path: "/user/update-phone",
                    method: "POST" as const,
                    handler: asyncHandler(updateUserPhoneNumber),
                },
                {
                    path: "/user/delete",
                    method: "POST" as const,
                    handler: asyncHandler(requestDeleteUser),
                }
            ]
        },
        {
            path: "/admin",
            method: "GET" as const,
            handler: notFoundHandler,
            middleware: [user_middleware, admin_middleware],
            children: [
                {
                    path: "/admin/first-admin",
                    method: "POST" as const,
                    handler: asyncHandler(requestFirstAdmin)
                },
                {
                    path: "/admin/make-admin",
                    method: "POST" as const,
                    handler: asyncHandler(requestMakeAdmin)
                },
                {
                    path: "/admin/update-admin",
                    method: "POST" as const,
                    handler: asyncHandler(requestUpdateAdmin)
                },
                {
                    path: "/admin/revoke-admin",
                    method: "POST" as const,
                    handler: asyncHandler(requestRevokeAdmin)
                }
            ]
        },
        {
            path: "wondamart-gh",
            method: "GET" as const,
            handler: notFoundHandler,
            middleware: [user_middleware, admin_middleware],
            children: [
                {
                    path: "/wondamart-gh/settings/init",
                    method: "POST" as const,
                    handler: asyncHandler(initCommonSettings)
                },
                {
                    path: "/wondamart-gh/data-bundles/create",
                    method: "POST" as const,
                    handler: asyncHandler(createDataBundle)
                },
                {
                    path: "/wondamart-gh/data-bundles/delete",
                    method: "POST" as const,
                    handler: asyncHandler(deleteDataBundle)
                }
            ]
        },
        {
            path: "/status",
            method: "GET" as const,
            handler: notFoundHandler,
            children: [
                {
                    path: "/status/tx-watcher",
                    method: "GET" as const,
                    handler: (req, res) => {
                        res.json({ watchedTransactions: TxWatcher.getWatchedCount() });
                    }
                }
            ]
        },
        {
            path: "/deposit",
            method: "GET" as const,
            handler: notFoundHandler,
            middleware: [user_middleware],
            children: [
                {
                    path: "/deposit/paystack",
                    method: "POST" as const,
                    handler: asyncHandler(paystackDeposit)
                },
                {
                    path: "/deposit/paystack/submit-otp",
                    method: "POST" as const,
                    handler: asyncHandler(paystackSubmitOTP)
                },
                {
                    path: "/deposit/send",
                    method: "POST" as const,
                    handler: asyncHandler(sendDeposit)
                },
                {
                    path: "/deposit/momo",
                    method: "POST" as const,
                    handler: asyncHandler(momoDeposit)
                }
            ]
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

