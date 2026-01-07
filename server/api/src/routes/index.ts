import buy from './buy';
import admin from './admin';
import user from './user';
import deposit from './deposit';
import {RouteConfig, RouteHandler} from "@common-server/express";
import webhooks from "@/routes/webhook";
import newRoutes from "@/routes/new";
import callbacks from "@/routes/callback";

const handler: RouteHandler = (req, res) => {
    res.send("Hello World! from api.wondamart.com");
};

const home: RouteConfig = {
    path: "/",
    get: handler,
    middleware: [],
    children: [
        buy,
        admin,
        user,
        deposit,
        webhooks,
        callbacks,
        newRoutes
    ]
};

export default home;