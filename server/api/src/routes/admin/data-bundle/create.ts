import {RouteConfig, RouteHandler, sendResponse} from "@common-server/express";
import type {AdminNewDataBundle} from "@common/types/data-bundle";
import {httpResponse} from "@common/types/request";
import {ThrowCheck} from "@common-server/fn/throw-check-fn";
import {DataBundleFn} from "@common-server/fn/data-bundle/data-bundle-fn";

export const handler: RouteHandler = async (req, res) => {
    const data = req.body as AdminNewDataBundle;
    if (!data || !req.userId) {
        return sendResponse(res, httpResponse("invalid", "Data bundle info and user ID required"));
    }

    const check = new ThrowCheck(res, req.userId);
    if (!await check.init()) return;
    if (!check.isUser()) return;
    if (!check.isUserDisabled()) return;
    if (!check.isActivated()) return;
    if (!check.isAdmin()) return;

    try {
        await DataBundleFn.create(data);
    } catch (error) {
        console.error("Error creating data bundle:", error);
        sendResponse(res, httpResponse(
            "error",
            "An unexpected error occurred while creating data bundle. Please try again."
        ))
    }
};

const createDataBundle : RouteConfig = {
    path: "/create",
    post: handler,
}
export default createDataBundle;