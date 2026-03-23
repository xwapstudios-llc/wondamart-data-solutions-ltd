import type {Timestamp} from "firebase/firestore";
import type {WhereFilterOp} from "firebase/firestore";

export type TxStatus = "pending" | "processing" | "success" | "failed";
export const txStatus = ["pending", "processing", "success", "failed"];

export type TxType =
    | "debit"
    | "paystack-deposit"
    | "manual-deposit"
    | "bundle-purchase"
    | "afa-purchase"
    | "checker-purchase"
    | "admin-debit"
    | "admin-credit"
    | "refund";

export const txTypes: TxType[] = [
    "debit",
    "paystack-deposit",
    "manual-deposit",
    "bundle-purchase",
    "afa-purchase",
    "checker-purchase",
    "admin-debit",
    "admin-credit",
    "refund",
];

export const txType = {
    debit: "debit" as TxType,
    paystackDeposit: "paystack-deposit" as TxType,
    manualDeposit: "manual-deposit" as TxType,
    bundlePurchase: "bundle-purchase" as TxType,
    afaPurchase: "afa-purchase" as TxType,
    checkerPurchase: "checker-purchase" as TxType,
    adminDebit: "admin-debit" as TxType,
    adminCredit: "admin-credit" as TxType,
    refund: "refund" as TxType,
};

export function txPrefix(type: TxType): string {
    switch (type) {
        case "paystack-deposit": return "pd_";
        case "manual-deposit":   return "md_";
        case "bundle-purchase":  return "bp_";
        case "afa-purchase":     return "ap_";
        case "checker-purchase": return "cp_";
        case "admin-debit":      return "ad_";
        case "admin-credit":     return "ac_";
        case "refund":           return "rf_";
        default:                 return "tx_";
    }
}

export function getTxTypeFromTxID(txID: string): TxType | "tx" {
    if (txID.startsWith("pd_")) return txType.paystackDeposit;
    if (txID.startsWith("md_")) return txType.manualDeposit;
    if (txID.startsWith("bp_")) return txType.bundlePurchase;
    if (txID.startsWith("ap_")) return txType.afaPurchase;
    if (txID.startsWith("cp_")) return txType.checkerPurchase;
    if (txID.startsWith("ad_")) return txType.adminDebit;
    if (txID.startsWith("ac_")) return txType.adminCredit;
    if (txID.startsWith("rf_")) return txType.refund;
    return "tx";
}

export interface Tx {
    txId: string;
    agentId: string;
    status: TxStatus;
    type: TxType;
    amount: number;
    balance: number;
    commission?: number;
    time: Timestamp;
    timeCompleted?: Timestamp;
    txData: object;
}

export interface TxQuery {
    agentId: string;
    type?: TxType;
    status?: TxStatus;
    startAfter?: number;
    limit?: number;
    amount?: number;
    amountCompare?: WhereFilterOp;
    commission?: number;
    commissionCompare?: WhereFilterOp;
    time?: Date | Timestamp | { from: Date | Timestamp; to: Date | Timestamp };
}

export interface TxQueryAdmin extends Omit<TxQuery, "agentId"> {
    agentId?: string;
}
