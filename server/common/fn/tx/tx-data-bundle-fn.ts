// Create
// Update
// Read
// Delete
// List
// Search

import {TxDataBundle, TxDataBundleRequest} from "@common/types/data-bundle";
import {TxFn} from "./tx-fn";
import {DataBundleFn} from "../data-bundle/data-bundle-fn";
import {txType} from "@common/types/tx";

const TxDataBundleFn = {
    async create(data: TxDataBundleRequest) {
        const bundle = await DataBundleFn.read_DataBundleDoc(data.bundleId);
        if (!bundle) {
            throw new Error("Requested Data Bundle does not exist");
        }
        if (bundle.network !== data.networkId) {
            throw new Error("Data Bundle network does not match the provided networkId");
        }
        // Create a new transaction document
        // Generate a new transaction ID
        const txDetails: TxDataBundle = {
            ...await TxFn.initialDoc(txType.dataBundle, data.uid),
            type: "data-bundle",
            amount: bundle.price,
            commission: bundle.commission,
            data: {
                network: data.networkId,
                bundleId: data.bundleId,
                dataPackage: bundle.dataPackage,
                validityPeriod: bundle.validityPeriod,
                phoneNumber: data.phoneNumber,
            }
        }
        return txDetails;
    },
    async read_TxDataBundleDoc(txID: string): Promise<TxDataBundle> {
        return await TxFn.read(txID) as TxDataBundle;
    },
    async createAndCommit(data: TxDataBundleRequest): Promise<TxDataBundle> {
        const details = await this.create(data);
        await TxFn.commit(details);
        return details;
    },
}

export {
    TxDataBundleFn
}