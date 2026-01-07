import {RouteConfig, RouteHandler, sendResponse} from "@common-server/express";
import {CommonSettingsFn} from "@common-server/fn/common-settings-fn";
import {ThrowCheck} from "@common-server/fn/throw-check-fn";
import {UserFn} from "@common-server/fn/user-fn";
import {httpResponse} from "@common/types/request";
import {mnotifyClient} from "@common-server/providers/mnotify/api";

export const handler: RouteHandler = async (req, res) => {
    const uid = req.userId!;

    const commonUserRegistration = await CommonSettingsFn.read_userRegistration();
    const check = new ThrowCheck(res, uid);
    if (!await check.init()) return;
    if (!await check.hasEnoughBalance(commonUserRegistration.unitPrice)) return;

    let balance_changed = false;
    try {
        await UserFn.update_sub_UserBalance(uid, commonUserRegistration.unitPrice);
        balance_changed = true;
        await UserFn.claims.activate(uid);
        const user = await UserFn.read_UserDoc(uid);
        mnotifyClient.sendSms({
            recipients: [user.phoneNumber],
            message: `Your account has been activated. Thank you for using Wondamart Data Solutions.`
        }).catch(err => {
            console.error("Failed to send SMS notification:", err);
        })
    } catch (error) {
        if (balance_changed) await UserFn.update_add_UserBalance(check.uid, commonUserRegistration.unitPrice);
        console.error("Error Activating user :", error);
        return sendResponse(res, httpResponse("error", "An unexpected error occurred. Please try again."));
    }
};

const activateAccount : RouteConfig = {
    path: "/activate-account",
    post: handler,
}
export default activateAccount;