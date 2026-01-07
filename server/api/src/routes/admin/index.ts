import firstAdmin from './first-admin';
import makeAdmin from './make-admin';
import updateAdmin from './update-admin';
import revokeAdmin from './revoke-admin';
import dataBundle from "./data-bundle"
import initCommonSettings from "@/routes/admin/settings/init";
import {admin_middleware, RouteConfig, user_middleware} from "@common-server/express";
import {origen_middleware} from "@common-server/express/origin_middleware";
import {api_middleware} from "@common-server/express/api_middleware";

const admin: RouteConfig = {
    path: "/admin",
    middleware: [origen_middleware, api_middleware, user_middleware, admin_middleware],
    children: [
        firstAdmin,
        makeAdmin,
        updateAdmin,
        revokeAdmin,
        dataBundle,
        initCommonSettings
    ]
};

export default admin;