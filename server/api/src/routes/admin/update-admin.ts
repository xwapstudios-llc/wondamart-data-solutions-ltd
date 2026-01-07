import {RouteHandler, sendResponse, RouteConfig} from "@common-server/express";
import {UserClaims, UserClaimsUpdate} from "@common/types/user";
import {httpResponse} from "@common/types/request";
import {ThrowCheck} from "@common-server/fn/throw-check-fn";
import {getAuth} from "firebase-admin/auth";
import {FieldValue} from "firebase-admin/firestore";

const handler: RouteHandler = async (req, res) => {
    const {data, requestingUid} = req.body as { data: UserClaimsUpdate; requestingUid: string };
    if (!data || !requestingUid) {
        return sendResponse(res, httpResponse("unauthenticated", "Data and requesting user ID required"));
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
    if (!check2.isAdmin("User is not an admin. Hence cannot update admin credentials.")) return;

    try {
        const auth = getAuth();
        await auth.setCustomUserClaims(data.uid, {
            ...data.credentials,
            updatedAt: FieldValue.serverTimestamp(),
            ...check2.userClaims
        } as UserClaims);

        sendResponse(res, httpResponse("ok", `User ${data.uid} is updated successfully.`));
    } catch (error) {
        console.error("Error updating user admin:", error);
        sendResponse(res, httpResponse("error", "An unexpected error occurred. Please try again."));
    }
};

const updateAdmin: RouteConfig = {
    path: "/update-admin",
    post: handler,
    middleware: []
};

export default updateAdmin;