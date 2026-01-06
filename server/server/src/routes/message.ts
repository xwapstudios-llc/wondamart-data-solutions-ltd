import { RouteHandler, sendResponse } from "@common-server/express";
import { httpResponse } from "@common/types/request";
import { modemManager } from "@/modem/modem-manager";

export const sendMessage: RouteHandler = async (req, res) => {
    const { number, text } = req.body;
    
    if (!number || !text) {
        return sendResponse(res, httpResponse("invalid-data", "Number and text required"));
    }

    try {
        const taskId = await modemManager.queueSMS(number, text);
        
        sendResponse(res, httpResponse("ok",
            "SMS request queued",
            { taskId, number, text }
        ));
    } catch (error) {
        sendResponse(res, httpResponse("error", {
            title: "Failed to queue SMS",
            message: error instanceof Error ? error.message : "Unknown error"
        }));
    }
};

export const getMessage: RouteHandler = async (req, res) => {
    try {
        const messages = await modemManager.listSMS();
        
        sendResponse(res, httpResponse("ok", "list is in data" , { messages }));
    } catch (error) {
        sendResponse(res, httpResponse("error", {
            title: "Get messages failed",
            message: error instanceof Error ? error.message : "Unknown error"
        }));
    }
};

export const deleteMessage: RouteHandler = async (req, res) => {
    const { smsPath } = req.body;
    
    if (!smsPath) {
        return sendResponse(res, httpResponse("invalid-data", "SMS path required"));
    }

    try {
        await modemManager.deleteSMS(smsPath);
        
        sendResponse(res, httpResponse("ok", "self.data", { smsPath }));
    } catch (error) {
        sendResponse(res, httpResponse("error", {
            title: "Delete failed",
            message: error instanceof Error ? error.message : "Unknown error"
        }));
    }
};