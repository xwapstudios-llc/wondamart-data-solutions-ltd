import { onCall, HttpsError } from "firebase-functions/v2/https";
import {ThrowCheck} from "./internals/throw-check-fn.js";
import {CommonSettingsFn} from "@common-server/fn/common-settings-fn.js";

export const initCommonSettings = onCall(async (event) => {
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


    try {
        await CommonSettingsFn.init();

        // Return a success status to the client.
        return {
            status: "success",
            message: `User ${event.auth.uid} document initialized successfully`,
        };
    } catch (error) {
        // Log the error for server-side debugging.
        console.error("Error initializing user:", error);
        // Throw an HttpsError to provide the client with a meaningful error.
        throw new HttpsError(
            "internal",
            "An unexpected error occurred. Please try again."
        );
    }
});