import {RouteConfig, RouteHandler, sendResponse} from "@common-server/express";
import {UserRegistrationRequest} from "@common/types/user";
import {ThrowCheck, ThrowCheckFn} from "@common-server/fn/throw-check-fn";
import {UserFn} from "@common-server/fn/user-fn";
import {CommonSettingsFn} from "@common-server/fn/common-settings-fn";
import {httpResponse} from "@common/types/request";
import {TxUserRegistrationFn} from "@common-server/fn/tx/tx-user-registration";
import {TxFn} from "@common-server/fn/tx/tx-fn";
import {getAuth} from "firebase-admin/auth";
import {userCollections, walletsCollections} from "@common-server/fn/collections";

export const handler: RouteHandler = async (req, res) => {
    const uid = req.userId!;
    const data = req.body as UserRegistrationRequest;
    const check = new ThrowCheck(res, uid);
    if (!await check.init()) return;
    if (!check.isUser()) return;
    if (!check.isUserDisabled()) return;
    if (!check.isActivated()) return;

    const wallet = await UserFn.read_UserWallet(check.uid);
    const commonUserRegistration = await CommonSettingsFn.read_userRegistration();

    if (!wallet) {
        return sendResponse(res, httpResponse("aborted", "Could not read user wallet"));
    }
    if (!commonUserRegistration) {
        return sendResponse(res, httpResponse("aborted", "Could not read User Registration Settings"));
    }
    if (wallet.balance < commonUserRegistration.unitPrice) {
        return sendResponse(res, httpResponse("cancelled", "Not enough Balance"));
    }

    const d = data;
    if (!d.email || !d.password || !d.firstName || !d.phoneNumber) {
        return sendResponse(res, httpResponse("invalid", "The function must be called with a email and phoneNumber."));
    }

    if (!await ThrowCheckFn.userAlreadyExistsByEmail(res, d.email)) return;
    if (!await ThrowCheckFn.userAlreadyExistsByPhone(res, d.phoneNumber)) return;

    let balance_changed = false;

    try {
        const newUID = await UserFn.createAccount(d);
        await UserFn.claims.activate(newUID);

        const tx = await TxUserRegistrationFn.createAndCommit(check.uid, newUID);
        await TxFn.update_status_processing(tx.id);
        await UserFn.update_sub_UserBalance(check.uid, commonUserRegistration.unitPrice);
        balance_changed = true;
        await TxFn.update_status_completed(tx.id);

        return sendResponse(res, httpResponse("ok", `User ${d.email} account registered successfully`));
    } catch (err) {
        const auth = getAuth();
        const userRecord = await auth.getUserByEmail(d.email).catch(() => null);
        if (userRecord) {
            await auth.deleteUser(userRecord.uid).catch(() => null);

            const userDoc = await userCollections.doc(userRecord?.uid || "somedoc").get();
            if (userDoc && userDoc.exists) {
                await userCollections.doc(userRecord!.uid).delete().catch(() => null);
            }
            const userWalletDoc = await walletsCollections.doc(userRecord?.uid || "somedoc").get();
            if (userWalletDoc && userWalletDoc.exists) {
                await walletsCollections.doc(userRecord!.uid).delete().catch(() => null);
            }
        }

        if (balance_changed) await UserFn.update_add_UserBalance(check.uid, commonUserRegistration.unitPrice);

        console.error("Error creating user:", err);
        return sendResponse(res, httpResponse("error", "An unexpected error occurred. Please try again."));
    }
};

const registerAgent : RouteConfig = {
    path: "/register-agent",
    post: handler,
}
export default registerAgent;