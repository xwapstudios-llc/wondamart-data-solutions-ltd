import { RouteHandler, sendResponse } from "@common-server/express";
import { httpResponse } from "@common/types/request";
import { TxDataBundleData, TxDataBundleRequest } from "@common/types/data-bundle";
import { ThrowCheck, ThrowCheckFn } from "@common-server/fn/throw-check-fn";
import { CommonSettingsFn } from "@common-server/fn/common-settings-fn";
import { DataBundleFn } from "@common-server/fn/data-bundle/data-bundle-fn";
import { TxDataBundleFn } from "@common-server/fn/tx/tx-data-bundle-fn";
import { TxFn } from "@common-server/fn/tx/tx-fn";
import { UserFn } from "@common-server/fn/user-fn";
import {
    HendyLinksClient,
    networkID_to_hendylinks_network,
    normalizePhone
} from "@common-server/providers/hendy-links/api";
import {
    DataMartClient,
    networkID_to_datamart_network,
    normalizeGhanaPhone
} from "@common-server/providers/data-mart/api";
import config from "@common-server/config";

const hendylinks_client = new HendyLinksClient({
    apiKey: config.hendylinks_api_key
});
const datamart_client = new DataMartClient({
    apiKey: config.datamart_api_key
});

export const buyDataBundle: RouteHandler = async (req, res) => {
    if (!await ThrowCheckFn.isServerActive(res)) return;

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

    await TxFn.update_status_processing(tx.id);
    if (!await check.hasEnoughBalance(tx.amount, tx)) return;
    
    await UserFn.update_sub_UserBalance(tx.uid, tx.amount);
    balance_modified = true;

    const data = tx.data as TxDataBundleData;

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
                await TxFn.addExtraData(tx.id, {
                    datamart_data: result.data,
                    datamart_id: result.data.transactionReference
                });
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
                if (result.data) {
                    await TxFn.addExtraData(tx.id, {
                        hendylinks_data: result.data,
                        hendylinks_id: result.data.order_id
                    });
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
        await TxFn.update_status_failed(tx.id);
        if (balance_modified) await UserFn.update_add_UserBalance(tx.uid, tx.amount);

        return sendResponse(res, httpResponse("critical_or_unhandled", {
            title: "Critical Error",
            message: "An undefined error occurred when placing order. Please contact admin."
        }));
    }
};