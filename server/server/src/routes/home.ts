import { RouteHandler, sendResponse } from "@common-server/express";
import { httpResponse } from "@common/types/request";

export const home: RouteHandler = (req, res) => {
    sendResponse(res, httpResponse("ok", "", {
        service: "Wondamart Modem Monitor",
        status: "running",
        timestamp: new Date().toISOString()
    }));
};