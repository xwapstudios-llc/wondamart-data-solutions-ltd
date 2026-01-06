import { RouteHandler, sendResponse } from "@common-server/express";
import { httpResponse } from "@common/types/request";

export const buyResultChecker: RouteHandler = async (req, res) => {
    sendResponse(res, httpResponse("rejected", "Result Checker purchase not implemented yet"));
};
