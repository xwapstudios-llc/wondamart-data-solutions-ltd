import {RouteHandler, sendResponse, RouteConfig} from "@common-server/express";
import {httpResponse} from "@common/types/request";
import {ThrowCheck} from "@common-server/fn/throw-check-fn";
import {getAuth} from "firebase-admin/auth";
import {UserClaims} from "@common/types/user";
import {FieldValue} from "firebase-admin/firestore";

const handler: RouteHandler = async (req, res) => {
    const {uid, requestingUid} = req.body as { uid: string; requestingUid: string };
    if (!uid || !requestingUid) {
        return sendResponse(res, httpResponse("unauthenticated", "User ID and requesting user ID required"));
    }
    const check = new ThrowCheck(res, requestingUid);
    if (!await check.init()) return;
    if (!check.isUser()) return;
    if (!check.isUserDisabled()) return;
    if (!check.isActivated()) return;
    if (!check.isAdmin()) return;

    const check2 = new ThrowCheck(res, requestingUid);
    if (!await check2.init()) return;
    if (!check2.isUser()) return;
    if (!check2.isUserDisabled()) return;
    if (!check2.isActivated()) return;
    if (!check2.isAdmin("User is not an admin. Hence cannot revoke admin.")) return;

    try {
        const auth = getAuth();
        await auth.setCustomUserClaims(uid, {
            isAdmin: false,
            adminAt: undefined,
            adminRole: undefined,
            updatedAt: FieldValue.serverTimestamp(),
            ...check2.userClaims
        } as UserClaims);

        sendResponse(res, httpResponse("ok", `User ${uid} is no longer an admin`));
    } catch (error) {
        console.error("Error revoking admin:", error);
        sendResponse(res, httpResponse("error", "An unexpected error occurred. Please try again."));
    }
};

const revokeAdmin: RouteConfig = {
    path: "/revoke-admin",
    post: handler,
    middleware: []
};

export default revokeAdmin;