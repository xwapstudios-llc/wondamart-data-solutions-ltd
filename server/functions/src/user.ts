import { onCall, HttpsError } from "firebase-functions/v2/https";

import {
    UserPhoneNumberUpdateRequest, UserRegistrationRequest
} from "@common/types/user.js";
import {getAuth} from "firebase-admin/auth";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import {ThrowCheck, ThrowCheckFn} from "./internals/throw-check-fn.js";
import {UserFn} from "@common-server/fn/user-fn.js";
import {userCollections, walletsCollections} from "@common-server/fn/collections.js";
import {CommonSettingsFn} from "@common-server/fn/common-settings-fn.js";
import {TxUserRegistrationFn} from "@common-server/fn/tx/tx-user-registration.js";
import {TxFn} from "@common-server/fn/tx/tx-fn.js";

const db = getFirestore();
const auth = getAuth();


export const createUser = onCall(async (event) => {
    // Sanitize and validate the input data.
    let d = event.data as UserRegistrationRequest;
    console.log("Received user creation request:", d);
    if (
        !d.email ||
        !d.password ||
        !d.firstName ||
        !d.phoneNumber
    ) {
        throw new HttpsError(
            "invalid-argument",
            "The function must be called with a email and phoneNumber."
        );
    }

    // Check if the user already exists
    // By email
    await ThrowCheckFn.userAlreadyExistsByEmail(d.email);
    // By phone
    await ThrowCheckFn.userAlreadyExistsByPhone(d.email);

    try {
        await UserFn.createAccount(d);
        // Return a success status to the client.
        return {
            status: "success",
            message: `User ${d.email} account created successfully`,
        };
    } catch (err) {
        // Clean the user if partially created
        const userRecord = await auth.getUserByEmail(d.email).catch(() => null);
        if (userRecord) {
            await auth.deleteUser(userRecord.uid).catch(() => null);

            // Clean database documents if partially created. users collection and wallets collection
            const userDoc = await userCollections.doc(userRecord?.uid || "somedoc").get();
            if (userDoc && userDoc.exists) {
                await userCollections.doc(userRecord!.uid).delete().catch(() => null);
            }
            const userWalletDoc = await walletsCollections.doc(userRecord?.uid || "somedoc").get();
            if (userWalletDoc && userWalletDoc.exists) {
                await walletsCollections.doc(userRecord!.uid).delete().catch(() => null);
            }
        }

        // Log the error for server-side debugging.
        console.error("Error creating user:", err);
        // Throw an HttpsError to provide the client with a meaningful error.
        throw new HttpsError(
            "internal",
            "An unexpected error occurred. Please try again."
        );
    }
});

export const registerNewAgent = onCall(async (event) => {
    // Check if the user is authenticated.
    if (!event.auth) {
        // Throwing an HttpsError so that the client gets a proper error message.
        throw new HttpsError(
            "unauthenticated",
            "The function must be called while authenticated."
        );
    }

    // Do checks
    const check = new ThrowCheck(event.auth.uid);
    await check.init();
    check.isUser();
    check.isUserDisabled();
    check.isActivated();

    // Check the balance of the user
    const wallet = await UserFn.read_UserWallet(check.uid);

    // Read common user registration cost
    const commonUserRegistration = await CommonSettingsFn.read_userRegistration();
    if (!wallet) {
        throw new HttpsError(
            "aborted",
            "Could not read user wallet"
        )
    }
    if (!commonUserRegistration) {
        throw new HttpsError(
            "aborted",
            "Could not read User Registration Settings"
        )
    }

    // If the user has enough money to register another user
    if (wallet.balance < commonUserRegistration.unitPrice) {
        throw new HttpsError(
            "cancelled",
            "Not enough Balance"
        )
    }

    // Sanitize and validate the input data.
    let data = event.data as UserRegistrationRequest;
    console.log("Received user creation request:", data);

    const d = data;
    if (
        !d.email ||
        !d.password ||
        !d.firstName ||
        !d.phoneNumber
    ) {
        throw new HttpsError(
            "invalid-argument",
            "The function must be called with a email and phoneNumber."
        );
    }
    // Check if the user already exists
    // By email
    await ThrowCheckFn.userAlreadyExistsByEmail(d.email);
    // By phone
    await ThrowCheckFn.userAlreadyExistsByPhone(d.email);

    let balance_changed = false;

    try {
        const newUID = await UserFn.createAccount(d);
        await UserFn.claims.activate(newUID);

        const tx = await TxUserRegistrationFn.createAndCommit(check.uid, newUID);

        await TxFn.update_status_processing(tx.id);

        await UserFn.update_sub_UserBalance(check.uid, commonUserRegistration.unitPrice);
        balance_changed = true;

        await TxFn.update_status_completed(tx.id);

        return {
            status: "success",
            message: `User ${d.email} account registered successfully`,
        };
    } catch (err) {
        // Clean the user if partially created
        const userRecord = await auth.getUserByEmail(d.email).catch(() => null);
        if (userRecord) {
            await auth.deleteUser(userRecord.uid).catch(() => null);

            // Clean database documents if partially created. users collection and wallets collection
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

        // Log the error for server-side debugging.
        console.error("Error creating user:", err);
        // Throw an HttpsError to provide the client with a meaningful error.
        throw new HttpsError(
            "internal",
            "An unexpected error occurred. Please try again."
        );
    }
});

export const requestActivateAccount = onCall(async (event) => {
    // Check if the user is authenticated.
    if (!event.auth) {
        // Throwing an HttpsError so that the client gets a proper error message.
        throw new HttpsError(
            "unauthenticated",
            "The function must be called while authenticated."
        );
    }

    // Get user id
    const uid = event.auth.uid;

    // Get common settings for user activation
    const commonUserRegistration = await CommonSettingsFn.read_userRegistration();
    const check = new ThrowCheck(uid);
    await check.init();
    await check.hasEnoughBalance(commonUserRegistration.unitPrice);

    let balance_changed = false;
    try {
        // Take money from user account
        await UserFn.update_sub_UserBalance(uid, commonUserRegistration.unitPrice);
        balance_changed = true;

        // Change account credential
        await UserFn.claims.activate(uid);
    } catch (error) {

        if (balance_changed) await UserFn.update_add_UserBalance(check.uid, commonUserRegistration.unitPrice);

        // Log the error for server-side debugging.
        console.error("Error Activating user :", error);
        // Throw an HttpsError to provide the client with a meaningful error.
        throw new HttpsError(
            "internal",
            "An unexpected error occurred. Please try again."
        );
    }
});

export const requestEmailVerification = onCall(async (event) => {
    // Check if the user is authenticated.
    if (!event.auth) {
        // Throwing an HttpsError so that the client gets a proper error message.
        throw new HttpsError(
            "unauthenticated",
            "The function must be called while authenticated."
        );
    }

    // Get user id
    const uid = event.auth.uid;

    // Do checks
    const check = new ThrowCheck(uid);
    await check.init();
    check.isUser();
    check.isUserDisabled("A disabled account cannot be verified");
    const user = await auth.getUser(uid);
    if (user.emailVerified) {
        throw new HttpsError(
            "cancelled",
            "Email is already verified. No need for verification."
        )
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
        // Log the error for server-side debugging.
        console.error("Error Creating email verification :", error);
        // Throw an HttpsError to provide the client with a meaningful error.
        throw new HttpsError(
            "internal",
            "An unexpected error occurred. Please try again."
        );
    }
});

export const updateUserPhoneNumber = onCall(async (event) => {
    // Check if the user is authenticated.
    if (!event.auth) {
        // Throwing an HttpsError so that the client gets a proper error message.
        throw new HttpsError(
            "unauthenticated",
            "The function must be called while authenticated."
        );
    }

    // Sanitize and validate the input data.
    let d = event.data as UserPhoneNumberUpdateRequest;
    if (
        !d.uid ||
        !d.phoneNumber
    ) {
        throw new HttpsError(
            "invalid-argument",
            "The function must be called with a phoneNumber."
        );
    }
    // Check if the uid matches the authenticated user's uid
    if (d.uid !== event.auth.uid) {
        throw new HttpsError(
            "permission-denied",
            "You can only update your own phone number."
        );
    }
    // Check if the phone number is already in use
    await ThrowCheckFn.userAlreadyExistsByPhone(d.phoneNumber);

    // Get previous phone number
    const userRecord = await auth.getUser(d.uid).catch(() => null);
    if (!userRecord) {
        throw new HttpsError(
            "not-found",
            `User with uid ${d.uid} not found.`
        );
    }
    if (userRecord.phoneNumber === d.phoneNumber) {
        throw new HttpsError(
            "failed-precondition",
            `The new phone number is the same as the current one.`
        );
    }
    const previousPhoneNumber = userRecord.phoneNumber;

    try {
        // Update the user's phone number in Firebase Auth and Firestore.
        await UserFn.update_phoneNumber(d.uid, d.phoneNumber);

        // Return a success status to the client.
        return {
            status: "success",
            message: `User ${d.uid} phone number updated successfully`,
        };
    } catch (error) {
        // Attempt to revert the phone number in Auth if Firestore update failed
        if (previousPhoneNumber) {
            await UserFn.update_phoneNumber(d.uid, previousPhoneNumber);
        }
        // Log the error for server-side debugging.
        console.error("Error updating phone number:", error);
        // Throw an HttpsError to provide the client with a meaningful error.
        throw new HttpsError(
            "internal",
            "An unexpected error occurred. Please try again."
        );
    }
});

export const requestDeleteUser = onCall(async (event) => {
    // Check if the user is authenticated.
    if (!event.auth) {
        // Throwing an HttpsError so that the client gets a proper error message.
        throw new HttpsError(
            "unauthenticated",
            "The function must be called while authenticated."
        );
    }

    const uID = event.data as string;

    // Reference the user's document in Firestore.
    const userRef = db.collection("users").doc(uID);

    // Check if user document exists
    const userDoc = await userRef.get();
    if (userDoc.exists === false) {
        throw new HttpsError(
            "not-found",
            `User with uid ${uID} not found.`
        );
    }

    try {
        // read the document data before deletion
        const userData = userDoc.data();

        // add it to deleted users collection with timestamp
        const deletedUsersRef = db.collection("deleted_users").doc(uID);
        await deletedUsersRef.set({
            ...userData,
            deletedAt: FieldValue.serverTimestamp(),
        });

        // delete user document
        await userRef.delete();

        // Reference the user's document in Firestore.
        const userWalletRef = db.collection("wallets").doc(uID);
        // Read the wallet document data before deletion
        const userWalletDoc = await userWalletRef.get();
        const userWalletData = userWalletDoc.exists ? userWalletDoc.data() : null;
        // Write to deleted wallets collection if exists
        if (userWalletData) {
            const deletedWalletsRef = db.collection("deleted_wallets").doc(uID);
            await deletedWalletsRef.set({
                ...userWalletData,
                deletedAt: FieldValue.serverTimestamp(),
            });
        }

        // delete user wallet document
        await userWalletRef.delete();

        /// Finally delete the user from Auth
        await auth.deleteUser(uID);


        // Return a success status to the client.
        return {
            status: "success",
            message: `User ${event.auth.uid} document deleted successfully`,
        };
    } catch (error) {
        // Log the error for server-side debugging.
        console.error("Error deleting user:", error);
        // Throw an HttpsError to provide the client with a meaningful error.
        throw new HttpsError(
            "internal",
            "An unexpected error occurred. Please try again."
        );
    }
});
