import { TxResultChecker, TxResultCheckerRequest } from "@common/types/result-checker";
import { TxFn } from "./tx-fn";
import {CommonSettingsFn} from "../common-settings-fn";
import {txType} from "@common/tx";

const TxResultCheckerFn = {
    async create(data: TxResultCheckerRequest) {
        const settings = await CommonSettingsFn.read_resultChecker();
        const txDetails: TxResultChecker = {
            ...await TxFn.initialDoc(txType.checkerPurchase, data.uid),
            type: "checker-purchase",
            amount: data.units * settings.unitPrice,
            commission: data.units * settings.commission,
            txData: {
                checkerType: data.checkerType,
                units: data.units,
            }
        };
        return txDetails;
    },
    async read_TxResultCheckerDoc(txId: string): Promise<TxResultChecker> {
        return await TxFn.read(txId) as TxResultChecker;
    },
    async createAndCommit(data: TxResultCheckerRequest): Promise<TxResultChecker> {
        const details = await this.create(data);
        await TxFn.commit(details);
        return details;
    }
};

export { TxResultCheckerFn };
