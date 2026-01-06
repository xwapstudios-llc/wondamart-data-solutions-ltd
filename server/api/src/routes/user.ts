import { RouteHandler, sendResponse } from "@common-server/express";
import { httpResponse } from "@common/types/request";
import { UserPhoneNumberUpdateRequest, UserRegistrationRequest } from "@common/types/user";
import {ThrowCheck, ThrowCheckFn} from "@common-server/fn/throw-check-fn";
import { UserFn } from "@common-server/fn/user-fn";
import {getAuth} from "firebase-admin/auth";
import {userCollections, walletsCollections} from "@common-server/fn/collections";
import {CommonSettingsFn} from "@common-server/fn/common-settings-fn";
import {TxUserRegistrationFn} from "@common-server/fn/tx/tx-user-registration";
import {TxFn} from "@common-server/fn/tx/tx-fn";
import {getFirestore} from "firebase-admin/firestore";
import {firestore} from "firebase-admin";
import FieldValue = firestore.FieldValue;

export const createUser: RouteHandler = async (req, res) => {
    const d = req.body as UserRegistrationRequest;
    if (!d.email || !d.password || !d.firstName || !d.phoneNumber) {
        return sendResponse(res, httpResponse(
            "invalid",
            "The function must be called with a email and phoneNumber."
        ));
    }

    if (!await ThrowCheckFn.userAlreadyExistsByEmail(res, d.email)) return;
    if (!await ThrowCheckFn.userAlreadyExistsByPhone(res, d.phoneNumber)) return;

    try {
        await UserFn.createAccount(d);
        sendResponse(res, httpResponse("ok", `User ${d.email} account created successfully`));
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

        console.error("Error creating user:", err);
        sendResponse(res, httpResponse("error", "An unexpected error occurred. Please try again."));
    }
};

export const registerNewAgent: RouteHandler = async (req, res) => {
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

export const requestActivateAccount: RouteHandler = async (req, res) => {
    const uid = req.userId!;

    const commonUserRegistration = await CommonSettingsFn.read_userRegistration();
    const check = new ThrowCheck(res, uid);
    if (!await check.init()) return;
    // if (!await check.hasEnoughBalance(commonUserRegistration.unitPrice)) return;

    let balance_changed = false;
    try {
        await UserFn.update_sub_UserBalance(uid, commonUserRegistration.unitPrice);
        balance_changed = true;
        await UserFn.claims.activate(uid);
    } catch (error) {
        if (balance_changed) await UserFn.update_add_UserBalance(check.uid, commonUserRegistration.unitPrice);
        console.error("Error Activating user :", error);
        return sendResponse(res, httpResponse("error", "An unexpected error occurred. Please try again."));
    }
};

export const requestEmailVerification: RouteHandler = async (req, res) => {
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

export const updateUserPhoneNumber: RouteHandler = async (req, res) => {
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

export const requestDeleteUser: RouteHandler = async (req, res) => {
    const uid = req.userId!;

    const db = getFirestore();
    const auth = getAuth();
    const userRef = db.collection("users").doc(uid);
    const userDoc = await userRef.get();
    if (!userDoc.exists) {
        return sendResponse(res, httpResponse("unauthorized", `User with uid ${uid} not found.`));
    }

    try {
        const userData = userDoc.data();

        const deletedUsersRef = db.collection("deleted_users").doc(uid);
        await deletedUsersRef.set({
            ...userData,
            deletedAt: FieldValue.serverTimestamp(),
        });

        await userRef.delete();

        const userWalletRef = db.collection("wallets").doc(uid);
        const userWalletDoc = await userWalletRef.get();
        const userWalletData = userWalletDoc.exists ? userWalletDoc.data() : null;

        if (userWalletData) {
            const deletedWalletsRef = db.collection("deleted_wallets").doc(uid);
            await deletedWalletsRef.set({
                ...userWalletData,
                deletedAt: FieldValue.serverTimestamp(),
            });
        }

        await userWalletRef.delete();
        await auth.deleteUser(uid);

        return sendResponse(res, httpResponse("ok", `User ${uid} document deleted successfully`));
    } catch (error) {
        console.error("Error deleting user:", error);
        return sendResponse(res, httpResponse("error", "An unexpected error occurred. Please try again."));
    }
};