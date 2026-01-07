import { RouteHandler, sendResponse, RouteConfig } from "@common-server/express";
import { httpResponse } from "@common/types/request";

const handler: RouteHandler = async (req, res) => {
    sendResponse(res, httpResponse("rejected", "Result Checker purchase not implemented yet"));
};

const resultChecker: RouteConfig = {
    path: "/result-checker",
    post: handler,
    middleware: []
};

export default resultChecker;
