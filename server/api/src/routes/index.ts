import buy from './buy';
import admin from './admin';
import user from './user';
import deposit from './deposit';
import {RouteConfig, RouteHandler} from "@common-server/express";
import webhooks from "@/routes/webhook";
import newRoutes from "@/routes/new";
import callbacks from "@/routes/callback";
// import {hendylinks_client} from "@common-server/providers/hendy-links/api";

const postHandler: RouteHandler = async (req, res) => {
    res.send("Hello World from wondamart!");
};
// const getHandler: RouteHandler = async (req, res) => {
//     try {
//         const response = await hendylinks_client.getBalance();
//         console.log("Hendylinks balance res:", response);
//         res.send("Hendylinks balance res:" + JSON.stringify(response));
//     } catch (e) {
//         console.log("Hendylinks balance err:", e);
//         res.send("Hendylinks balance err:" + JSON.stringify(e));
//     }
// };

const home: RouteConfig = {
    path: "/",
    post: postHandler,
    // get: getHandler,
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