import {RouteConfig, RouteHandler, sendResponse} from "@common-server/express";
import {ThrowCheck} from "@common-server/fn/throw-check-fn";
import {getAuth} from "firebase-admin/auth";
import {httpResponse} from "@common/types/request";

export const handler: RouteHandler = async (req, res) => {
    const uid = req.userId!;

    const check = new ThrowCheck(res, uid);
    if (!await check.init()) return;
    if (!check.isUser()) return;
    if (!check.isUserDisabled("A disabled account cannot be verified")) return;

    const auth = getAuth();
    const user = await auth.getUser(uid);
    if (user.emailVerified) {
        sendResponse(res, httpResponse("cancelled", "Email is already verified. No need for verification."));
    }

    try {
        if (user && user.email != null && !user.emailVerified) {
            auth.generateEmailVerificationLink(user.email, {
                url: `https://wondamartgh.com/auth/verify-email/${user.email}`,
            }).then((result) => {
                console.log("This is the result for email verification.");
                console.log(result);
            }).catch((reason) => {
                console.log(reason);
            });
        }
    } catch (error) {
        console.error("Error Creating email verification :", error);
        sendResponse(res, httpResponse("error", "An unexpected error occurred. Please try again."));
    }
};

const emailVerification : RouteConfig = {
    path: "/email-verification",
    post: handler,
}

export default emailVerification;
