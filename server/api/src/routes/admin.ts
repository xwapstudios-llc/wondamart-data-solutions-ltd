import { RouteHandler, sendResponse } from "@common-server/express";
import { httpResponse } from "@common/types/request";
import {UserClaims, UserClaimsUpdate} from "@common/types/user";
import {ThrowCheck} from "@common-server/fn/throw-check-fn";
import {UserFn} from "@common-server/fn/user-fn";
import {firestore} from "firebase-admin";
import FieldValue = firestore.FieldValue;
import {getAuth} from "firebase-admin/auth";

export const requestFirstAdmin: RouteHandler = async (req, res) => {
    const { uid } = req.body as { uid: string };
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

export const requestMakeAdmin: RouteHandler = async (req, res) => {
    const { uid, requestingUid } = req.body as { uid: string; requestingUid: string };
    if (!uid || !requestingUid) {
        return sendResponse(res, httpResponse("unauthenticated", "User ID and requesting user ID required"));
    }

    const check = new ThrowCheck(res, requestingUid);
    if (!await check.init()) return;
    if (!check.isUser()) return;
    if (!check.isUserDisabled()) return;
    if (!check.isActivated()) return;
    if (!check.isAdmin()) return;

    const check2 = new ThrowCheck(res, uid);
    if (!await check2.init()) return;
    if (!check2.isUser()) return;
    if (!check2.isUserDisabled()) return;
    if (!check2.isActivated()) return;

    try {
        const auth = getAuth();
        await auth.setCustomUserClaims(uid, {
            isAdmin: true,
            adminAt: FieldValue.serverTimestamp(),
            updatedAt: FieldValue.serverTimestamp(),
            adminRole: {
                dataBundles: {
                    read: true
                },
                users: {
                    read: true
                },
                commissions: {
                    read: true
                },
                transactions: {
                    read: true
                }
            },
            ...check2.userClaims
        } as UserClaims);

        sendResponse(res, httpResponse("ok", `User ${uid} is now an admin`));
    } catch (error) {
        console.error("Error making user admin:", error);
        sendResponse(res, httpResponse("error", "An unexpected error occurred. Please try again."));
    }
};

export const requestUpdateAdmin: RouteHandler = async (req, res) => {
    const { data, requestingUid } = req.body as { data: UserClaimsUpdate; requestingUid: string };
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

export const requestRevokeAdmin: RouteHandler = async (req, res) => {
    const { uid, requestingUid } = req.body as { uid: string; requestingUid: string };
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