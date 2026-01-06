import { onCall } from "firebase-functions/v2/https";
import { httpResponse } from "@common/types/request.js";
import { fbInitCommonSettings } from "@common-server/fb-fn/common-settings.js";

export const initCommonSettings = onCall(async (event) => {
    if (!event.auth) {
        throw httpResponse("unauthenticated", "The function must be called while authenticated.");
    }

    return await fbInitCommonSettings(event.auth.uid);
});