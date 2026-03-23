import { RouteHandler, sendResponse, RouteConfig } from "@common-server/express";
import { httpResponse } from "@common/types/request";
import { TxDataBundleData, TxDataBundleRequest } from "@common/types/data-bundle";
import { ThrowCheck } from "@common-server/fn/throw-check-fn";
import { CommonSettingsFn } from "@common-server/fn/common-settings-fn";
import { DataBundleFn } from "@common-server/fn/data-bundle/data-bundle-fn";
import { TxDataBundleFn } from "@common-server/fn/tx/tx-data-bundle-fn";
import { TxFn } from "@common-server/fn/tx/tx-fn";
import { UserFn } from "@common-server/fn/user-fn";
import {
    hendylinks_client,
    networkID_to_hendylinks_network,
    normalizePhone
} from "@common-server/providers/hendy-links/api";
import {
    datamart_client,
    networkID_to_datamart_network,
    normalizeGhanaPhone
} from "@common-server/providers/data-mart/api";

const handler: RouteHandler = async (req, res) => {
    console.log("buyDataBundle", req.body);

    const uid = req.userId!;
    const d = req.body as Omit<TxDataBundleRequest, 'uid'>;

    if (!d.bundleId) {
        return sendResponse(res, httpResponse("invalid-data", "The request does not have a valid data bundle id."));
    }
    if (!d.networkId || d.networkId.length < 3) {
        return sendResponse(res, httpResponse("invalid-data", "The request does not have a valid network id."));
    }
    if (!d.phoneNumber || d.phoneNumber.length < 10) {
        return sendResponse(res, httpResponse("invalid-data", "The request does not have a valid phone number."));
    }

    const check = new ThrowCheck(res, uid);
    if (!await check.init()) return;
    if (!check.isUser()) return;
    if (!check.isUserDisabled()) return;
    if (!check.isActivated()) return;

    const commonSettings = await CommonSettingsFn.read_dataBundles();
    if (!commonSettings.enabled || !commonSettings[d.networkId].enabled) {
        return sendResponse(res, httpResponse("aborted", "Data Bundle is not available"));
    }

    const dataBundle = await DataBundleFn.read_DataBundleDoc(d.bundleId);
    if (!dataBundle || !dataBundle.enabled) {
        return sendResponse(res, httpResponse("aborted", "Data Bundle is not available"));
    }

    let balance_modified = false;
    const tx = await TxDataBundleFn.createAndCommit({ ...d, uid });

    await TxFn.update_status_processing(tx.txId);
    if (!await check.hasEnoughBalance(tx.amount, tx)) return;

    await UserFn.update_sub_UserBalance(tx.agentId, tx.amount);
    balance_modified = true;

    const data = tx.txData as TxDataBundleData;

    try {
        switch (commonSettings.provider) {
            case "datamart": {
                const result = await datamart_client.purchaseData({
                    capacity: dataBundle.dataPackage.data.toString(),
                    network: networkID_to_datamart_network(dataBundle.network),
                    phoneNumber: normalizeGhanaPhone(data.phoneNumber),
                });
                if (result.status === "error") {
                    return sendResponse(res, httpResponse("failed", "Failed to place order. Reason: " + result.message));
                }
                await TxFn.addDatamartData(tx.txId, result.data);
                await TxFn.update_status_pending(tx.txId);
                return sendResponse(res, httpResponse("ok", "Order placed successfully"));
            }

            case "hendylinks": {
                const result = await hendylinks_client.createOrder({
                    size_gb: dataBundle.dataPackage.data,
                    network: networkID_to_hendylinks_network(dataBundle.network),
                    recipient_phone: normalizePhone(data.phoneNumber),
                });
                if (!result.success) {
                    return sendResponse(res, httpResponse("failed", "Failed to place order. Reason: " + result.message));
                }
                await TxFn.addHendyLinksData(tx.txId, result);
                if (result.status === "pending") {
                    await TxFn.update_status_pending(tx.txId);
                }
                return sendResponse(res, httpResponse("ok", "Order placed successfully"));
            }

            case "wondamart":
                return sendResponse(res, httpResponse("aborted", {
                    title: "Critical Error",
                    message: "Wondamart is not yet a provider. Please contact admin."
                }));

            default:
                return sendResponse(res, httpResponse("error", {
                    title: "Critical Error",
                    message: "Unknown Provider in admin settings. Please contact admin."
                }));
        }
    } catch (e) {
        console.log("@buyDataBundle - catch error => ", e);
        await TxFn.update_status_failed(tx.txId);
        if (balance_modified) await UserFn.update_add_UserBalance(tx.agentId, tx.amount);
        return sendResponse(res, httpResponse("failed", {
            title: "Failed",
            message: "An undefined error occurred when placing order. Please contact admin."
        }));
    }
};

const dataBundle: RouteConfig = {
    path: "/data-bundle",
    post: handler,
    middleware: []
};

export default dataBundle;
