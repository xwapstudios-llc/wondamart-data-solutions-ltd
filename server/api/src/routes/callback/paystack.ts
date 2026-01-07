import {RouteConfig, RouteHandler} from "@common-server/express";
export const handler: RouteHandler = async (req, res) => {
    console.log("Received Paystack callback ------------------------------------");
    console.log(JSON.stringify(req.body, null, 2));
    console.log("------------------------------------");

    res.sendStatus(200);
};

const paystackCallback: RouteConfig = {
    path: "/paystack",
    post: handler,
};

export default paystackCallback;