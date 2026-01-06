import { RouteHandler, sendResponse } from "@common-server/express";
import { httpResponse } from "@common/types/request";

export const buyAfaBundle: RouteHandler = async (req, res) => {
    sendResponse(res, httpResponse("rejected", "AFA Bundle purchase not implemented yet"));
};
