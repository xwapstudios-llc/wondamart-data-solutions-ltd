import { RouteHandler, sendResponse } from "@common-server/express";
import { httpResponse } from "@common/types/request";
import { modemManager } from "@/modem/modem-manager";

export const sendUSSD: RouteHandler = async (req, res) => {
    const { code } = req.body;
    
    if (!code) {
        return sendResponse(res, httpResponse("invalid-data", "USSD code required"));
    }

    try {
        const taskId = await modemManager.queueUSSD(code);
        
        sendResponse(res, httpResponse("ok",
            "USSD request queued",
            { taskId, code }
        ));
    } catch (error) {
        sendResponse(res, httpResponse("error", {
            title: "Failed to queue USSD",
            message: error instanceof Error ? error.message : "Unknown error"
        }));
    }
};

export const cancelUSSD: RouteHandler = async (req, res) => {
    try {
        await modemManager.cancelUSSD();
        
        sendResponse(res, httpResponse("ok", "USSD session cancelled"));
    } catch (error) {
        sendResponse(res, httpResponse("error", {
            title: "USSD cancel failed",
            message: error instanceof Error ? error.message : "Unknown error"
        }));
    }
};