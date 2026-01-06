import { RouteHandler, sendResponse } from "@common-server/express";
import { httpResponse } from "@common/types/request";
import {ThrowCheck} from "@common-server/fn/throw-check-fn";
import {CommonSettingsFn} from "@common-server/fn/common-settings-fn";

export const initCommonSettings: RouteHandler = async (req, res) => {
    const { uid } = req.body as { uid: string };
    if (!uid) {
        return sendResponse(res, httpResponse("unauthenticated", "User ID required"));
    }

    const check = new ThrowCheck(res, uid);
    if (!await check.init()) return;
    if (!check.isUser()) return;
    if (!check.isUserDisabled()) return;

    try {
        await CommonSettingsFn.init();
        sendResponse(res, httpResponse("ok", `User ${uid} document initialized successfully`));
    } catch (error) {
        console.error("Error initializing user:", error);
        sendResponse(res, httpResponse("error", "An unexpected error occurred. Please try again."));
    }
};