import { onCall } from "firebase-functions/v2/https";
import {AdminNewDataBundle} from "@common/types/data-bundle.js";
import { httpResponse } from "@common/types/request.js";
import {DataBundleFn} from "@common-server/fn/data-bundle/data-bundle-fn.js";
import {ThrowCheck} from "./internals/throw-check-fn.js";


export const createDataBundle = onCall(async (event) => {
    console.log("createDataBundle called with data:", event.data);

    // Check if the user is authenticated.
    if (!event.auth) {
        // Throwing an HttpsError so that the client gets a proper error message.
        throw httpResponse(
            "unauthenticated",
            "The function must be called while authenticated.",
        );
    }

    // Sanitize and validate the input data.
    let d = event.data as AdminNewDataBundle;


    // Do checks
    const check = new ThrowCheck(event.auth.uid);
    await check.init();
    check.isUser();
    check.isUserDisabled();
    check.isActivated();

    // Check if the user has admin privileges
    check.isAdmin();

    try {
        await DataBundleFn.create(d);
    } catch (error) {
        // Log the error for server-side debugging.
        console.error("Error creating data bundle:", error);
        // Throw an HttpsError to provide the client with a meaningful error.
        throw httpResponse(
            "error",
            "An unexpected error occurred while creating data bundle. Please try again."
        );
    }
});


export const deleteDataBundle = onCall(async (event) => {
    console.log("deleteDataBundle called with data:", event.data);

    // Check if the user is authenticated.
    if (!event.auth) {
        // Throwing an HttpsError so that the client gets a proper error message.
        throw httpResponse(
            "unauthenticated",
            "The function must be called while authenticated.",
        );
    }

    // Sanitize and validate the input data.
    let bundleID = event.data as string;


    // Do checks
    const check = new ThrowCheck(event.auth.uid);
    await check.init();
    check.isUser();
    check.isUserDisabled();
    check.isActivated();

    // Check if the user has admin privileges
    check.isAdmin();

    try {
        await DataBundleFn.delete(bundleID);
    } catch (error) {
        // Log the error for server-side debugging.
        console.error("Error deleting data bundle:", error);
        // Throw an HttpsError to provide the client with a meaningful error.
        throw httpResponse(
            "error",
            "An unexpected error occurred while deleting data bundle. Please try again."
        );
    }
});
