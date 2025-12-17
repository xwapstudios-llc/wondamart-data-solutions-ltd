import { NetworkId } from "./data-bundle";
import { Tx, TxQuery } from "./tx";

//
//  SubType
export interface TxAccountDepositQuery extends TxQuery {
    type: "deposit",
    network?: NetworkId,
    phoneNumber?: string,
}

//
// Database Type
export type AccountDepositType = "paystack" | "send" | "momo";
export type TxDepositData = TxDepositPaystackData | TxDepositSendData | TxDepositMoMoData;
export interface TxDeposit extends Tx {
    type: 'deposit';
    data: TxDepositData;
}

interface Deposit {
    type: AccountDepositType;
}
// Client Data Type
export interface TxDepositPaystackData extends Deposit {
    type: "paystack";
    phoneNumber: string;
    email: string;
    network: NetworkId;
}
export interface TxDepositSendData extends Deposit {
    type: "send";
    transactionID: string;
}
export interface TxDepositMoMoData extends Deposit {
    type: "momo";
    phoneNumber: string;
}


// Request
export interface TxDepositPaystackRequest extends Omit<TxDepositPaystackData, "type"> {
    uid: string;
    amount: number;
}
export interface TxDepositSendRequest extends Omit<TxDepositSendData, "type"> {
    uid: string;
}
export interface TxDepositMoMoRequest extends Omit<TxDepositMoMoData, "type"> {
    uid: string;
    amount: number;
}
