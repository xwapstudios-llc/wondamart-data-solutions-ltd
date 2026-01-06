import {
    createExpressApp,
    startServer,
    asyncHandler,
    ExpressAppConfig,
    notFoundHandler,
    admin_middleware
} from "@common-server/express";
import config from "@common-server/config";
import { api_middleware } from "@common-server/express/api_middleware";
import { origen_middleware } from "@common-server/express/origin_middleware";
import { home, momoCashIn, momoCashOut, sendMessage, getMessage, deleteMessage, sendUSSD, cancelUSSD } from "./routes";

const appConfig: ExpressAppConfig = {
    port: config.port_server,
    host: config.host_local_server,
    name: "modem.wondamartgh.com",
    middleware: [origen_middleware, api_middleware],
    routes: [
        {
            path: "/",
            method: "GET" as const,
            handler: home
        },
        {
            path: "/momo",
            method: "GET" as const,
            handler: notFoundHandler,
            children: [
                {
                    path: "/momo/cash-in",
                    method: "POST" as const,
                    handler: asyncHandler(momoCashIn)
                },
                {
                    path: "/momo/cash-out",
                    method: "POST" as const,
                    handler: asyncHandler(momoCashOut)
                }
            ]
        },
        {
            path: "/message",
            method: "GET" as const,
            handler: notFoundHandler,
            middleware: [admin_middleware],
            children: [
                {
                    path: "/message/send",
                    method: "POST" as const,
                    handler: asyncHandler(sendMessage)
                },
                {
                    path: "/message/get",
                    method: "GET" as const,
                    handler: asyncHandler(getMessage)
                },
                {
                    path: "/message/delete",
                    method: "DELETE" as const,
                    handler: asyncHandler(deleteMessage)
                }
            ]
        },
        {
            path: "/ussd",
            method: "GET" as const,
            handler: notFoundHandler,
            middleware: [admin_middleware],
            children: [
                {
                    path: "/ussd/send",
                    method: "POST" as const,
                    handler: asyncHandler(sendUSSD)
                },
                {
                    path: "/ussd/cancel",
                    method: "POST" as const,
                    handler: asyncHandler(cancelUSSD)
                }
            ]
        }
    ]
};

const app = createExpressApp(appConfig);
startServer(app, appConfig);