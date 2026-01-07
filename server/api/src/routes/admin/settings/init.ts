import {RouteConfig, RouteHandler, sendResponse} from "@common-server/express";
import {httpResponse} from "@common/types/request";
import {ThrowCheck} from "@common-server/fn/throw-check-fn";
import {CommonSettingsFn} from "@common-server/fn/common-settings-fn";

export const handler: RouteHandler = async (req, res) => {
    console.log("Init common setting received")
    if (!req.userId) {
        console.log("No user id is found");
        return sendResponse(res, httpResponse("unauthenticated", "User ID required"));
    }
    console.log("req.userId is valid => ", req.userId);

    const check = new ThrowCheck(res, req.userId);
    if (!await check.init()) return;
    if (!check.isUser()) return;
    if (!check.isUserDisabled()) return;

    console.log("User passed ThrowChecks ");

    try {
        await CommonSettingsFn.init();
        console.log("Common Settings initialized");
        sendResponse(res, httpResponse("ok", `User ${req.userId} document initialized successfully`));
    } catch (error) {
        console.error("Error initializing user:", error);
        sendResponse(res, httpResponse("error", "An unexpected error occurred. Please try again."));
    }
};

const initCommonSettings : RouteConfig = {
    path: "/settings/init",
    post: handler,
}
export default initCommonSettings;