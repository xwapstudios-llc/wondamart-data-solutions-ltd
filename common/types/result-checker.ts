import { type Tx, type TxQuery } from "@common/tx";

//
//  SubType
export type ResultCheckerType = 'BECE' | 'WASSCE';
export interface TxResultCheckerQuery extends TxQuery {
    checkerType?: ResultCheckerType,
    units?: number,
}

//
// Database Type
export interface TxResultCheckerData {
    checkerType: ResultCheckerType;
    units: number;
}
export interface TxResultChecker extends Tx {
    type: 'checker-purchase';
    txData: TxResultCheckerData;
}

//
// Form Type
export interface ResultCheckerForm {
    checkerType: ResultCheckerType;
    units: number;
}

//
// Client Request Type
export interface TxResultCheckerRequest {
    uid: string;
    checkerType: ResultCheckerType;
    units: number;
}
//
