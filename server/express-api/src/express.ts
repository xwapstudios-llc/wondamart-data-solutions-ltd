import express from "express";
import config from "@common-server/config";
import {firebaseOnlyMiddleware} from "@common-server/utils/express";
import {
    HendyLinksClient,
    networkID_to_hendylinks_network,
    normalizePhone
} from "@common-server/providers/hendy-links/api";
import {Tx} from "@common/types/tx";
import {httpResponse} from "@common/types/request";
import {TxDataBundleData} from "@common/types/data-bundle";
import {TxFn} from "@common-server/fn/tx/tx-fn";
import {CommonSettingsFn} from "@common-server/fn/common-settings-fn";
import {
    DataMartClient,
    networkID_to_datamart_network,
    normalizeGhanaPhone
} from "@common-server/providers/data-mart/api";
import {DataBundleFn} from "@common-server/fn/data-bundle/data-bundle-fn";

const app = express();
app.use(express.json());

const port = config.port_api;
const host = config.host_local_server;

app.use(firebaseOnlyMiddleware);
const hendylinks_client = new HendyLinksClient({
    apiKey: config.hendylinks_api_key
});
const datamart_client = new DataMartClient({
    apiKey: config.datamart_api_key
})

app.get("/", (req, res) => {
    res.send("Hello World! from api.wondamart.com");
});

app.post("/buy/data-bundle", async (req, res) => {
    // sanitize data
    const tx = req.body as Tx;
    if (!tx.uid || tx.id || tx.type) {
        await TxFn.update_status_failed(tx.id);
        const response = httpResponse(
            "invalid-data",
            "The requested data is missing uid or id or type"
        )
        return res.status(response.status).json(response);
    }
    if (tx.type != "data-bundle") {
        await TxFn.update_status_failed(tx.id);
        const response = httpResponse(
            "rejected",
            "The request is not a data bundle."
        )
        return res.status(response.status).json(response);
    }

    // Start processing
    await TxFn.update_status_processing(tx.id);
    const data = tx.data as TxDataBundleData;

    if (!data.bundleId || data.bundleId == "") {
        await TxFn.update_status_failed(tx.id);
        const response = httpResponse(
            "invalid-data",
            "The request does not have a valid data bundle id."
        )
        return res.status(response.status).json(response);
    }
    if (!data.network || data.network.length < 3) {
        await TxFn.update_status_failed(tx.id);
        const response = httpResponse(
            "invalid-data",
            "The request does not have a valid network id."
        )
        return res.status(response.status).json(response);
    }

    const commonSettings = await CommonSettingsFn.read_dataBundles();
    if (!commonSettings.enabled || commonSettings[data.network].enabled) {
        const response = httpResponse(
            "aborted",
            "Data Bundle is not available"
        )
        return res.status(response.status).json(response);
    }

    const dataBundle = await DataBundleFn.read_DataBundleDoc(data.bundleId);
    if (!dataBundle || !dataBundle.enabled) {
        const response = httpResponse(
            "aborted",
            "Data Bundle is not available"
        )
        return res.status(response.status).json(response);
    }

    try {
        switch (commonSettings.provider) {
            case "datamart": {
                const result = await datamart_client.purchaseData({
                    capacity: dataBundle.dataPackage.data.toString(),
                    network: networkID_to_datamart_network(dataBundle.network),
                    phoneNumber: normalizeGhanaPhone(data.phoneNumber),
                });
                if (result.status === "error") {
                    const response = httpResponse(
                        "failed",
                        "Failed to place order. Reason: " + result.message
                    )
                    return res.status(response.status).json(response);
                }
                await TxFn.addExtraData(tx.id, {
                    datamart_data: result.data,
                    datamart_id: result.data.transactionReference
                });
                const response = httpResponse(
                    "ok",
                    "Order places successfully"
                )
                return res.status(response.status).json(response);
            }


            case "hendylinks": {
                const result = await hendylinks_client.createOrder({
                    size_gb: dataBundle.dataPackage.data,
                    network: networkID_to_hendylinks_network(dataBundle.network),
                    recipient_phone: normalizePhone(data.phoneNumber),
                });
                if (!result.success) {
                    const response = httpResponse(
                        "failed",
                        "Failed to place order. Reason: " + result.message
                    )
                    return res.status(response.status).json(response);
                }
                if (result.data)
                    await TxFn.addExtraData(tx.id, {
                        hendylinks_data: result.data,
                        hendylinks_id: result.data.order_id
                    });
                const response = httpResponse(
                    "ok",
                    "Order places successfully"
                )
                return res.status(response.status).json(response);
            }


            case "wondamart": {
                const response = httpResponse(
                    "aborted",
                    {
                        title: "Critical Error",
                        message: "Wondamart is not yet a provider. Please contact admin."
                    }
                )
                return res.status(response.status).json(response);
            }
            default: {
                const response = httpResponse(
                    "error",
                    {
                        title: "Critical Error",
                        message: "Unknown Provider in admin settings. Please contact admin."
                    }
                )
                return res.status(response.status).json(response);
            }
        }
    } catch (e) {
        // Order Status failed
        await TxFn.update_status_failed(tx.id);
        const response = httpResponse(
            "critical_or_unhandled",
            {
                title: "Critical Error",
                message: "An undefined error occurred when placing order. Please contact admin."
            }
        )
        return res.status(response.status).json(response);
    }
});

app.post("/buy/afa-bundle", async (req, res) => {});

app.post("/buy/result-checker", async (req, res) => {});

app.listen(port, () => {
    console.log(`api.wondamartgh.com running at http://${host}:${port}`);
});
