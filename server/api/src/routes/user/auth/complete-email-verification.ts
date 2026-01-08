import {RouteConfig, RouteHandler, sendResponse} from "@common-server/express";
import {ThrowCheck} from "@common-server/fn/throw-check-fn";
import {httpResponse} from "@common/types/request";
import {PayloadWatcher} from "@common-server/utils/payload-watcher";

export const handler: RouteHandler = async (req, res) => {
    const uid = req.userId!;

    const check = new ThrowCheck(res, uid);
    if (!await check.init()) return;
    if (!check.isUser()) return;
    if (!check.isUserDisabled("A disabled account cannot be verified")) return;

    try {
        const payload = PayloadWatcher.getPayload(uid);
        if (payload) {
            await payload();
            PayloadWatcher.removeFromWatch(uid);
            sendResponse(res, httpResponse("ok", "Email verified successfully."));
        } else {
            sendResponse(res, httpResponse("rejected", "Email verification expired. Please try again."));
        }
    } catch (error) {
        console.error("Error completing email verification :", error);
        sendResponse(res, httpResponse("error", "An unexpected error occurred. Please try again."));
    }
};

const completeEmailVerification : RouteConfig = {
    path: "/complete-email-verification",
    post: handler,
}

export default completeEmailVerification;
