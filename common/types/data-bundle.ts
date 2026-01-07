
import { Timestamp } from "firebase/firestore";
import { type Tx, type TxQuery } from "./tx"

//
//  SubTypes
export type NetworkId = "mtn" | "telecel" | "airteltigo";
export const networkIds: NetworkId[] = ["mtn", "telecel", "airteltigo"];
export type ValidityPeriod = number;

export interface DataPackage {
    data: number;
    minutes?: number; // Some data bundles come with minutes
    sms?: number;     // Some data bundles come with sms
}
export interface DataBundleQuery {
    network?: NetworkId;
    validityPeriod?: ValidityPeriod;
}
export interface TxDataBundleQuery extends TxQuery {
    network?: NetworkId,
    bundleId?: string,
    phoneNumber?: string,
}


//
// Database Type
export interface DataBundle {
    id: string;
    network: NetworkId;
    name?: string;
    price: number; // Price in cedis
    dataPackage: DataPackage;
    validityPeriod: ValidityPeriod; // Validity period in days
    enabled: boolean;
    commission: number; // Commission in cedis
    createdAt?: Timestamp;
    updatedAt?: Timestamp;
}

export interface TxDataBundleData {
    network: NetworkId;
    bundleId: string;
    phoneNumber: string;
    dataPackage: DataPackage;
    validityPeriod: ValidityPeriod;
}
export interface TxDataBundle extends Tx {
    type: 'data-bundle';
    data: TxDataBundleData;
}

//
// Form Type
export interface DataBundleForm {
    bundleId: string;
    network: NetworkId;
    phoneNumber: string;
}

//
// Client Request Type
export interface TxDataBundleRequest {
    uid: string;
    networkId: NetworkId;
    bundleId: string;
    phoneNumber: string;
}
//
// Admin Request Type
export type AdminNewDataBundle = Omit<DataBundle, "id" | "createdAt" | "updatedAt">;