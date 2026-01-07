import activateAccount from "@/routes/user/activate-account";
import deleteAccount from "./delete";
import emailVerification from "@/routes/user/email-verification";
import registerAgent from "@/routes/user/register-agent";
import updatePhoneNumber from "@/routes/user/update-phone-number";

import {notFoundHandler, RouteConfig, user_middleware} from "@common-server/express";
import {origen_middleware} from "@common-server/express/origin_middleware";
import {api_middleware} from "@common-server/express/api_middleware";

const user: RouteConfig = {
    path: "/user",
    middleware: [origen_middleware, api_middleware, user_middleware],
    children: [
        activateAccount,
        deleteAccount,
        emailVerification,
        registerAgent,
        updatePhoneNumber,
    ]
};

export default user;