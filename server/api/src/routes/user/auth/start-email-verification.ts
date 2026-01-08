import {RouteConfig, RouteHandler, sendResponse} from "@common-server/express";
import {ThrowCheck} from "@common-server/fn/throw-check-fn";
import {httpResponse} from "@common/types/request";
import {PayloadWatcher} from "@common-server/utils/payload-watcher";
import {UserFn} from "@common-server/fn/user-fn";

export const handler: RouteHandler = async (req, res) => {
    const uid = req.userId!;

    const check = new ThrowCheck(res, uid);
    if (!await check.init()) return;
    if (!check.isUser()) return;
    if (!check.isUserDisabled("A disabled account cannot be verified")) return;

    const claims = await UserFn.claims.read(uid);
    if (claims && claims.email_verified) {
        sendResponse(res, httpResponse("cancelled", "Email is already verified. No need for verification."));
    }

    try {
        PayloadWatcher.addToWatch(async () => {
            await UserFn.claims.update(uid, {email_verified: true});
            console.log("Email verification completed for user => ", uid);
        }, 5, uid);
        console.log("Email verification payload created for user => ", uid);
        sendResponse(res, httpResponse("send_email", "Email verification started successfully."));
    } catch (error) {
        console.error("Error Creating email verification :", error);
        sendResponse(res, httpResponse("error", "An unexpected error occurred. Please try again."));
    }
};

const startEmailVerification : RouteConfig = {
    path: "/start-email-verification",
    post: handler,
}

export default startEmailVerification;
