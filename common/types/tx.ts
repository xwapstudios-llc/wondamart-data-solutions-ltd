import {Timestamp, type WhereFilterOp} from "firebase/firestore";
import {type TxDataBundleData} from "@common/types/data-bundle";
import {type TxAfaBundleData} from "@common/types/afa-bundle";
import {type TxResultCheckerData} from "@common/types/result-checker";
import {type TxDepositData} from "@common/types/account-deposit";
import {type TxUserRegistrationData} from "@common/types/user-registration";

//
// SubType
export type TxData = TxDataBundleData | TxAfaBundleData | TxResultCheckerData | TxDepositData | TxUserRegistrationData;

export type TxStatus = "processing" | "pending" | "completed" | "failed";
export const txStatus: TxStatus[] = [
    "pending",
    "processing",
    "completed",
    "failed",
    // "canceled" // TODO: Add a canceled
];
export type TxType =
    | "data-bundle"
    | "afa-bundle"
    | "result-checker"
    | "user-registration"
    | "deposit";
export const txTypes: TxType[] = [
    "data-bundle",
    "afa-bundle",
    "result-checker",
    "user-registration",
    "deposit",
];
export const txType = {
    dataBundle: "data-bundle" as TxType,
    afaBundle: "afa-bundle" as TxType,
    resultChecker: "result-checker" as TxType,
    userRegistration: "user-registration" as TxType,
    deposit: "deposit" as TxType,
}

export function txPrefix(type: TxType): string {
    switch (type) {
        case "afa-bundle": return "af_";
        case "data-bundle": return "db_";
        case "user-registration": return "ur_";
        case "result-checker": return "rc_";
        case "deposit": return "dp_";
        default: return "tx_";
    }
}
export function getTxTypeFromTxID(txID: string) {
    if (txID.startsWith("af_")) return txType.afaBundle;
    if (txID.startsWith("db_")) return txType.dataBundle;
    if (txID.startsWith("ur_")) return txType.userRegistration;
    if (txID.startsWith("rc_")) return txType.resultChecker;
    if (txID.startsWith("dp_")) return txType.deposit;
    else return "tx";
}


export interface Tx {
    id: string;
    uid: string;
    status: TxStatus;
    type: TxType;

    data: TxData;
    amount: number;
    commission: number;

    date: Timestamp;
    updatedAt?: Timestamp;
    finishedAt?: Timestamp;
}

export interface TxQuery {
    uid: string;

    type?: TxType;
    status?: TxStatus;

    startAfter?: number;
    limit?: number;

    amount?: number;
    amountCompare?: WhereFilterOp;
    commission?: number;
    commissionCompare?: WhereFilterOp;

    // Accept either:
    // - a Date
    // - a Firestore Timestamp
    // - a range { from, to } of Date or Timestamp
    date?: Date | Timestamp | { from: Date | Timestamp; to: Date | Timestamp };
}
export interface TxQueryAdmin extends Omit<TxQuery, "uid"> {
    uid?: string;
}
