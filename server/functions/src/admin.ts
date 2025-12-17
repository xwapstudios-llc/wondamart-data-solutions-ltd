import { onCall, HttpsError } from "firebase-functions/v2/https";
import {UserClaims, UserClaimsUpdate} from "@common/types/user.js";

import { getAuth } from "firebase-admin/auth";
import {FieldValue} from "firebase-admin/firestore";
import {ThrowCheck} from "./internals/throw-check-fn.js";
import {UserFn} from "@common-server/fn/user-fn.js";
const auth = getAuth();


export const requestFirstAdmin = onCall(async (event) => {
    // Check if the user is authenticated.
    if (!event.auth) {
        // Throwing an HttpsError so that the client gets a proper error message.
        throw new HttpsError(
            "unauthenticated",
            "The function must be called while authenticated."
        );
    }

    // check if request is made by an admin user
    const requestingUser = await auth.getUser(event.auth.uid);

    const uid = requestingUser.uid;

    // Do checks
    const check = new ThrowCheck(event.auth.uid);
    await check.init();
    check.isUser();
    check.isUserDisabled();
    check.isActivated();

    try {
        /// Update custom userClaims in Auth
        await UserFn.claims.makeAdmin(uid);

        // Return a success status to the client.
        return {
            status: "success",
            message: `User ${uid} is now an admin`,
        };
    } catch (error) {
        // Log the error for server-side debugging.
        console.error("Error making user admin:", error);
        // Throw an HttpsError to provide the client with a meaningful error.
        throw new HttpsError(
            "internal",
            "An unexpected error occurred. Please try again."
        );
    }
});

export const requestMakeAdmin = onCall(async (event) => {
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

    // Check if the user has admin privileges
    check.isAdmin();

    const uid = event.data as string;


    // Do checks
    const check2 = new ThrowCheck(uid);
    // Reference the user is registered not disabled and activated.
    check2.isUser();
    check2.isUserDisabled();
    check2.isActivated();


    try {
        /// Update custom userClaims in Auth
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

        // Return a success status to the client.
        return {
            status: "success",
            message: `User ${uid} is now an admin`,
        };
    } catch (error) {
        // Log the error for server-side debugging.
        console.error("Error making user admin:", error);
        // Throw an HttpsError to provide the client with a meaningful error.
        throw new HttpsError(
            "internal",
            "An unexpected error occurred. Please try again."
        );
    }
});

export const requestUpdateAdmin = onCall(async (event) => {
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

    // Check if the user has admin privileges
    check.isAdmin();

    const data = event.data as UserClaimsUpdate;

    // Reference the user is registered.

    // Do checks
    const check2 = new ThrowCheck(event.auth.uid);
    check2.isUser();
    check2.isUserDisabled();
    check2.isActivated();

    // Check if the user has admin privileges
    check2.isAdmin("User is not an admin. Hence cannot update admin credentials.");

    try {
        /// Update custom userClaims in Auth
        await auth.setCustomUserClaims(data.uid, {
            ...data.credentials,
            updatedAt: FieldValue.serverTimestamp(),
            ...check2.userClaims
        } as UserClaims);

        // Return a success status to the client.
        return {
            status: "success",
            message: `User ${data.uid} is updated successfully.`,
        };
    } catch (error) {
        // Log the error for server-side debugging.
        console.error("Error updating user admin:", error);
        // Throw an HttpsError to provide the client with a meaningful error.
        throw new HttpsError(
            "internal",
            "An unexpected error occurred. Please try again."
        );
    }
});

export const requestRevokeAdmin = onCall(async (event) => {
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

    // Check if the user has admin privileges
    check.isAdmin();

    const uid = event.data as string;

    // Reference the user is registered.

    // Do checks
    const check2 = new ThrowCheck(event.auth.uid);
    check2.isUser();
    check2.isUserDisabled();
    check2.isActivated();

    // Check if the user has admin privileges
    check2.isAdmin("User is not an admin. Hence cannot revoke admin.");

    try {
        /// Update custom userClaims in Auth
        await auth.setCustomUserClaims(uid, {
            isAdmin: false,
            adminAt: undefined,
            adminRole: undefined,
            updatedAt: FieldValue.serverTimestamp(),
            ...check2.userClaims
        } as UserClaims);

        // Return a success status to the client.
        return {
            status: "success",
            message: `User ${uid} is no longer an admin`,
        };
    } catch (error) {
        // Log the error for server-side debugging.
        console.error("Error revoking admin:", error);
        // Throw an HttpsError to provide the client with a meaningful error.
        throw new HttpsError(
            "internal",
            "An unexpected error occurred. Please try again."
        );
    }
});