import newUser from "@/routes/new/user";
import {MiddlewareHandler, RouteConfig, RouteHandler} from "@common-server/express";
import {origen_middleware} from "@common-server/express/origin_middleware";
import {api_middleware} from "@common-server/express/api_middleware";

const newRoutes : RouteConfig = {
    path: "/new",
    middleware: [origen_middleware, api_middleware],
    children: [
        newUser
    ]
}

export default newRoutes;
