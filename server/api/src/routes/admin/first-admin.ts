import {RouteConfig, RouteHandler, sendResponse} from "@common-server/express";
import {httpResponse} from "@common/types/request";
import {ThrowCheck} from "@common-server/fn/throw-check-fn";
import {UserFn} from "@common-server/fn/user-fn";

const handler: RouteHandler = async (req, res) => {
    console.log("requestFirstAdmin");
    const uid = req.userId;
    if (!uid) {
        return sendResponse(res, httpResponse("unauthenticated", "User ID required"));
    }

    const check = new ThrowCheck(res, uid);
    if (!await check.init()) return;
    if (!check.isUser()) return;
    if (!check.isUserDisabled()) return;
    if (!check.isActivated()) return;

    try {
        await UserFn.claims.makeAdmin(uid);
        sendResponse(res, httpResponse("ok", `User ${uid} is now an admin`));
    } catch (error) {
        console.error("Error making user admin:", error);
        sendResponse(res, httpResponse("error", "An unexpected error occurred. Please try again."));
    }
};

const firstAdmin: RouteConfig = {
    path: "/first-admin",
    post: handler,
}
export default firstAdmin;