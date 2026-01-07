import {RouteConfig, RouteHandler, sendResponse} from "@common-server/express";
import {httpResponse} from "@common/types/request";
import {ThrowCheck} from "@common-server/fn/throw-check-fn";
import {DataBundleFn} from "@common-server/fn/data-bundle/data-bundle-fn";

export const handler: RouteHandler = async (req, res) => {
    const { bundleId, uid } = req.body as { bundleId: string; uid: string };
    if (!bundleId || !uid) {
        return sendResponse(res, httpResponse("invalid", "Bundle ID and user ID required"));
    }

    const check = new ThrowCheck(res, uid);
    if (!await check.init()) return;
    if (!check.isUser()) return;
    if (!check.isUserDisabled()) return;
    if (!check.isActivated()) return;
    if (!check.isAdmin()) return;

    try {
        await DataBundleFn.delete(bundleId);
    } catch (error) {
        console.error("Error deleting data bundle:", error);
        return sendResponse(res, httpResponse(
            "error",
            "An unexpected error occurred while deleting data bundle. Please try again."
        ));
    }
};


const deleteDataBundle : RouteConfig = {
    path: "/delete",
    post: handler,
}
export default deleteDataBundle;