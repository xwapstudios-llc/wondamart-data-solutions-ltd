import {TxDataBundle, TxDataBundleRequest} from "@common/types/data-bundle";
import {TxFn} from "./tx-fn";
import {DataBundleFn} from "../data-bundle/data-bundle-fn";
import {txType} from "@common/tx";

const TxDataBundleFn = {
    async create(data: TxDataBundleRequest) {
        const bundle = await DataBundleFn.read_DataBundleDoc(data.bundleId);
        if (!bundle) throw new Error("Requested Data Bundle does not exist");
        if (bundle.network !== data.networkId) throw new Error("Data Bundle network does not match the provided networkId");
        const txDetails: TxDataBundle = {
            ...await TxFn.initialDoc(txType.bundlePurchase, data.uid),
            type: "bundle-purchase",
            amount: bundle.price,
            commission: bundle.commission,
            txData: {
                network: data.networkId,
                bundleId: data.bundleId,
                dataPackage: bundle.dataPackage,
                validityPeriod: bundle.validityPeriod,
                phoneNumber: data.phoneNumber,
            }
        };
        return txDetails;
    },
    async read_TxDataBundleDoc(txId: string): Promise<TxDataBundle> {
        return await TxFn.read(txId) as TxDataBundle;
    },
    async createAndCommit(data: TxDataBundleRequest): Promise<TxDataBundle> {
        const details = await this.create(data);
        await TxFn.commit(details);
        return details;
    },
};

export { TxDataBundleFn };