import { RouteHandler } from "@common-server/express";

export const home: RouteHandler = (req, res) => {
    res.send("Hello World! from pay.wondamart.com");
};