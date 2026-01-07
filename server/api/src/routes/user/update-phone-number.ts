import {RouteConfig, RouteHandler, sendResponse} from "@common-server/express";
import {UserPhoneNumberUpdateRequest} from "@common/types/user";
import {httpResponse} from "@common/types/request";
import {ThrowCheckFn} from "@common-server/fn/throw-check-fn";
import {getAuth} from "firebase-admin/auth";
import {UserFn} from "@common-server/fn/user-fn";

export const handler: RouteHandler = async (req, res) => {
    const uid = req.userId!;
    const d = req.body as UserPhoneNumberUpdateRequest;
    if (!d.phoneNumber) {
        return sendResponse(res, httpResponse("invalid", "The function must be called with a phoneNumber."));
    }

    if (!await ThrowCheckFn.userAlreadyExistsByPhone(res, d.phoneNumber)) return;

    const auth = getAuth();
    const userRecord = await auth.getUser(uid).catch(() => null);
    if (!userRecord) {
        return sendResponse(res, httpResponse("unauthorized", `User with uid ${uid} not found.`));
    }
    if (userRecord.phoneNumber === d.phoneNumber) {
        return sendResponse(res, httpResponse("invalid", `The new phone number is the same as the current one.`));
    }
    const previousPhoneNumber = userRecord.phoneNumber;

    try {
        await UserFn.update_phoneNumber(uid, d.phoneNumber);
        httpResponse("ok", `User ${uid} phone number updated successfully`);
    } catch (error) {
        if (previousPhoneNumber) {
            await UserFn.update_phoneNumber(uid, previousPhoneNumber);
        }
        console.error("Error updating phone number:", error);
        sendResponse(res, httpResponse("error", "An unexpected error occurred. Please try again."));
    }
};

const updatePhoneNumber : RouteConfig = {
    path: "/update-phone-number",
    post: handler,
}

export default updatePhoneNumber;
