import { RouteHandler, sendResponse } from "@common-server/express";
import { httpResponse } from "@common/types/request";
import { modemManager } from "@/modem/modem-manager";

export const momoCashIn: RouteHandler = async (req, res) => {
    const { number, amount } = req.body;
    
    if (!number || !amount) {
        return sendResponse(res, httpResponse("invalid-data", "Number and amount required"));
    }

    try {
        const taskId = await modemManager.queueCashIn(number, amount);
        
        sendResponse(res, httpResponse("ok",
            "Deposit request queued",
            { taskId, number, amount }
        ));
    } catch (error) {
        sendResponse(res, httpResponse("error", {
            title: "Failed to queue deposit",
            message: error instanceof Error ? error.message : "Unknown error"
        }));
    }
};

export const momoCashOut: RouteHandler = async (req, res) => {
    const { number, amount } = req.body;
    
    if (!number || !amount) {
        return sendResponse(res, httpResponse("invalid-data", "Number and amount required"));
    }

    try {
        const taskId = await modemManager.queueCashOut(number, amount);
        
        sendResponse(res, httpResponse("ok",
            "Cash out request queued",
            { taskId, number, amount}
        ));
    } catch (error) {
        sendResponse(res, httpResponse("error", {
            title: "Failed to queue cash out",
            message: error instanceof Error ? error.message : "Unknown error"
        }));
    }
};