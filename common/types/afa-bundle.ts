import { Tx, TxQuery } from "./tx";

//
//  SubType
export interface TxAfaBundleQuery extends TxQuery {
    type: "afa-bundle",
    phoneNumber?: string,
    idNumber?: string,
    date_of_birth?: string,
}
//
// Database Type
export interface TxAfaBundleData {
    fullName: string;
    phoneNumber: string;
    idNumber: string;
    date_of_birth: Date; // date of birth as string
    location: string;
    occupation: string;
}
export interface TxAfaBundle extends Tx {
    type: 'afa-bundle';
    data: TxAfaBundleData;
}

//
// Form Type
export interface AfaBundleForm {
    units: number;
    fullName: string;
    phoneNumber: string;
    idNumber: string;
    date_of_birth: Date; // date of birth as string
    location: string;
    occupation: string;
}
//
// Client Request Type
export interface TxAfaBundleRequest {
    uid: string;
    fullName: string;
    phoneNumber: string;
    idNumber: string;
    date_of_birth: Date; // date of birth as string
    location: string;
    occupation: string;
}
