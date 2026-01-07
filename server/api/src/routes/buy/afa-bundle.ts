import { RouteHandler, sendResponse, RouteConfig } from "@common-server/express";
import { httpResponse } from "@common/types/request";

const handler: RouteHandler = async (req, res) => {
    sendResponse(res, httpResponse("rejected", "AFA Bundle purchase not implemented yet"));
};

const afaBundle: RouteConfig = {
    path: "/afa-bundle",
    post: handler,
    middleware: []
};

export default afaBundle;
