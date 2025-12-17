// Create
// Update
// Read
// Delete
// List
// Search

import { TxResultChecker, TxResultCheckerRequest } from "@common/types/result-checker";
import { TxFn } from "./tx-fn";
import {CommonSettingsFn} from "../common-settings-fn";
import {txType} from "@common/types/tx";

const TxResultCheckerFn = {
    async create(data: TxResultCheckerRequest) {
        const settings = await CommonSettingsFn.read_resultChecker();
        const txDetails: TxResultChecker = {
            ...await TxFn.initialDoc(txType.resultChecker, data.uid),
            type: "result-checker",
            amount: data.units * settings.unitPrice,
            commission: data.units * settings.commission,
            data: {
                checkerType: data.checkerType,
                units: data.units,
            }
        };
        return txDetails;
    },
    async read_TxResultCheckerDoc(txID: string): Promise<TxResultChecker> {
        return await TxFn.read(txID) as TxResultChecker;
    },
    async createAndCommit(data: TxResultCheckerRequest): Promise<TxResultChecker> {
        const details = await this.create(data);
        await TxFn.commit(details);
        return details;
    }
};

export { TxResultCheckerFn };
