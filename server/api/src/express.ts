import {createExpressApp, startServer, asyncHandler, ExpressAppConfig} from "@common-server/express";
import config from "@common-server/config";
import { home, buyDataBundle, buyAfaBundle, buyResultChecker,
    createUser, registerNewAgent, requestActivateAccount, requestEmailVerification,
    updateUserPhoneNumber, requestDeleteUser, requestFirstAdmin, requestMakeAdmin,
    requestUpdateAdmin, requestRevokeAdmin, initCommonSettings, createDataBundle,
    deleteDataBundle, autoFailDeposits } from "./routes";
import {api_key_middleware} from "@common-server/express/api_key_middleware";
import {setInterval} from "node:timers";
import {origen_middleware} from "@common-server/express/origin_middleware";

const appConfig: ExpressAppConfig = {
    port: config.port_api,
    host: config.host_server,
    name: "api.wondamartgh.com",
    middleware: [api_key_middleware, origen_middleware],
    routes: [
        {
            path: "/",
            method: "GET" as const,
            handler: home
        },
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
        },
        // User routes
        {
            path: "/user/create",
            method: "POST" as const,
            handler: asyncHandler(createUser)
        },
        {
            path: "/user/register-agent",
            method: "POST" as const,
            handler: asyncHandler(registerNewAgent)
        },
        {
            path: "/user/activate",
            method: "POST" as const,
            handler: asyncHandler(requestActivateAccount)
        },
        {
            path: "/user/verify-email",
            method: "POST" as const,
            handler: asyncHandler(requestEmailVerification)
        },
        {
            path: "/user/update-phone",
            method: "POST" as const,
            handler: asyncHandler(updateUserPhoneNumber)
        },
        {
            path: "/user/delete",
            method: "POST" as const,
            handler: asyncHandler(requestDeleteUser)
        },
        // Admin routes
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
        },
        // Settings routes
        {
            path: "/settings/init",
            method: "POST" as const,
            handler: asyncHandler(initCommonSettings)
        },
        // Data bundle management routes
        {
            path: "/data-bundles/create",
            method: "POST" as const,
            handler: asyncHandler(createDataBundle)
        },
        {
            path: "/data-bundles/delete",
            method: "POST" as const,
            handler: asyncHandler(deleteDataBundle)
        },
        // Task routes
        {
            path: "/tasks/auto-fail-deposits",
            method: "POST" as const,
            handler: asyncHandler(autoFailDeposits)
        }
    ]
};

const app = createExpressApp(appConfig);
startServer(app, appConfig);

setInterval(() => {
    console.log("Checking for failed deposits...");
    /// Make a call to auto-fail-deposits
    autoFailDeposits({} as any, {} as any, () => {});
}, 1000 * 60 * 60 * 24);
