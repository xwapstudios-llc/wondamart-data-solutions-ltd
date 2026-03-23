import { TxAfaBundle, TxAfaBundleRequest } from "@common/types/afa-bundle";
import { TxFn } from "./tx-fn";
import {CommonSettingsFn} from "../common-settings-fn";
import {txType} from "@common/tx";

const TxAfaBundleFn = {
    async create(data: TxAfaBundleRequest) {
        const settings = await CommonSettingsFn.read_afa();
        const txDetails: TxAfaBundle = {
            ...await TxFn.initialDoc(txType.afaPurchase, data.uid),
            type: "afa-purchase",
            amount: settings.unitPrice,
            commission: settings.commission,
            txData: {
                fullName: data.fullName,
                phoneNumber: data.phoneNumber,
                idNumber: data.idNumber,
                date_of_birth: data.date_of_birth,
                location: data.location,
                occupation: data.occupation,
            }
        };
        return txDetails;
    },
    async read_TxAfaBundleDoc(txId: string): Promise<TxAfaBundle> {
        return await TxFn.read(txId) as TxAfaBundle;
    },
    async createAndCommit(data: TxAfaBundleRequest): Promise<TxAfaBundle> {
        const details = await this.create(data);
        await TxFn.commit(details);
        return details;
    }
};

export { TxAfaBundleFn };
