import { type NetworkId } from "./data-bundle";
import { type Tx, type TxQuery } from "@common/tx";

//
//  SubType
export interface TxAccountDepositQuery extends TxQuery {
    network?: NetworkId,
    phoneNumber?: string,
}

//
// Database Type
export type AccountDepositType = "paystack" | "send" | "momo";
export type TxDepositData = TxDepositPaystackData | TxDepositSendData | TxDepositMoMoData;
export interface TxDeposit extends Tx {
    type: 'paystack-deposit';
    txData: TxDepositData;
}

interface Deposit {
    depositType: AccountDepositType;
}
// Client Data Type
export interface TxDepositPaystackData extends Deposit {
    depositType: "paystack";
    phoneNumber: string;
    email: string;
    network: NetworkId;
}
export interface TxDepositSendData extends Deposit {
    depositType: "send";
    transactionID: string;
}
export interface TxDepositMoMoData extends Deposit {
    depositType: "momo";
    phoneNumber: string;
}

// Request
export interface TxDepositPaystackRequest extends Omit<TxDepositPaystackData, "depositType"> {
    uid: string;
    amount: number;
}
export interface TxSubmitOTPRequest {
    uid: string;
    txID: string;
    otp: string;
}
export interface TxDepositSendRequest extends Omit<TxDepositSendData, "depositType"> {
    uid: string;
}
export interface TxDepositMoMoRequest extends Omit<TxDepositMoMoData, "depositType"> {
    uid: string;
    amount: number;
}
