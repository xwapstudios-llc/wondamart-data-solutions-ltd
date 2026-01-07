import axios, { AxiosInstance } from "axios";
import {NetworkId} from "@common/types/data-bundle";

/** =========================
 * Core Types
 * ========================= */

export type DataMartNetwork = "TELECEL" | "YELLO" | "AT_PREMIUM";

export type ApiStatus = "success" | "error";

export interface DatamartApiSuccess<T> {
    status: "success";
    data: T;
}

export interface DatamartApiError {
    status: "error";
    message: string;
    details?: unknown;
}

export type DatamartApiResponse<T> = DatamartApiSuccess<T> | DatamartApiError;

/** =========================
 * Purchase
 * ========================= */

export interface DatamartPurchasePayload {
    phoneNumber: string;
    network: DataMartNetwork;
    capacity: string; // GB as string per API contract
    gateway?: "wallet";
}

export interface DatamartPurchaseResult {
    purchaseId: string;
    transactionReference: string;
    network: DataMartNetwork;
    capacity: string;
    mb: string;
    price: number;
    remainingBalance: number;
    geonetechResponse?: unknown;
}

/** =========================
 * Data Packages
 * ========================= */

export interface DatamartDataPackage {
    capacity: string;
    mb: string;
    price: string;
    network: DataMartNetwork;
}

export type DatamartAllNetworkPackages = Record<DataMartNetwork, DatamartDataPackage[]>;

/** =========================
 * Transactions
 * ========================= */

export interface DatamartTransaction {
    _id: string;
    userId: string;
    type: "purchase" | string;
    amount: number;
    status: "completed" | "pending" | "failed";
    reference: string;
    gateway: string;
    createdAt: string;
    updatedAt: string;
}

export interface DatamartTransactionsResponse {
    transactions: DatamartTransaction[];
    pagination: {
        currentPage: number;
        totalPages: number;
        totalItems: number;
    };
}

/** =========================
 * Referral Bonus
 * ========================= */

export interface DatamartReferralBonusResult {
    bonusClaimed: number;
    processedBonuses: string[];
    newWalletBalance: number;
}

/** =========================
 * Client Config
 * ========================= */

export interface DataMartClientConfig {
    apiKey: string;
    baseURL?: string;
    timeoutMs?: number;
}

/** =========================
 * DataMart API Client
 * ========================= */

export class DataMartClient {
    private http: AxiosInstance;

    constructor(config: DataMartClientConfig) {
        if (!config.apiKey) {
            throw new Error("DataMart API key is required");
        }

        this.http = axios.create({
            baseURL: config.baseURL ?? "https://api.datamartgh.shop/api/developer",
            timeout: config.timeoutMs ?? 15000,
            headers: {
                "Content-Type": "application/json",
                "X-API-Key": config.apiKey,
            },
        });
    }

    /** =========================
     * Purchase Data
     * ========================= */

    async purchaseData(
        payload: DatamartPurchasePayload
    ): Promise<DatamartApiResponse<DatamartPurchaseResult>> {
        const { data } = await this.http.post<DatamartApiResponse<DatamartPurchaseResult>>(
            "/purchase",
            { ...payload, gateway: payload.gateway ?? "wallet" }
        );
        return data;
    }

    /** =========================
     * Data Packages
     * ========================= */

    async getDataPackages(
        network?: DataMartNetwork
    ): Promise<DatamartApiResponse<DatamartDataPackage[] | DatamartAllNetworkPackages>> {
        const { data } = await this.http.get<
            DatamartApiResponse<DatamartDataPackage[] | DatamartAllNetworkPackages>
        >("/data-packages", { params: network ? { network } : undefined });
        return data;
    }

    /** =========================
     * Transactions
     * ========================= */

    async getTransactions(
        page = 1,
        limit = 20
    ): Promise<DatamartApiResponse<DatamartTransactionsResponse>> {
        const { data } = await this.http.get<DatamartApiResponse<DatamartTransactionsResponse>>(
            "/transactions",
            { params: { page, limit } }
        );
        return data;
    }

    /** =========================
     * Referral Bonus
     * ========================= */

    async claimReferralBonus(): Promise<DatamartApiResponse<DatamartReferralBonusResult>> {
        const { data } = await this.http.post<DatamartApiResponse<DatamartReferralBonusResult>>(
            "/claim-referral-bonus"
        );
        return data;
    }
}

/** =========================
 * Utilities
 * ========================= */

export function normalizeGhanaPhone(phone: string): string {
    if (/^0\d{9}$/.test(phone)) return phone;
    if (/^\d{9}$/.test(phone)) return `0${phone}`;
    if (/^233\d{9}$/.test(phone)) return `0${phone.slice(3)}`;
    throw new Error("Invalid Ghana phone number format");
}

export function assertCapacity(capacityGb: number): string {
    if (capacityGb <= 0) throw new Error("Capacity must be greater than zero");
    return String(capacityGb);
}

export function networkID_to_datamart_network(network: NetworkId): DataMartNetwork {
    switch (network) {
        case "mtn": return "YELLO"
        case "telecel": return "TELECEL"
        case "airteltigo": return "AT_PREMIUM"
        default: throw new Error("Network ID is required");
    }
}


// async function main() {
//     const datamart = new DataMartClient({
//         apiKey: process.env.DATAMART_API_KEY!,
//     });
//
//     const result = await datamart.purchaseData({
//         phoneNumber: normalizeGhanaPhone("0551234567"),
//         network: "TELECEL",
//         capacity: assertCapacity(5),
//     });
//
//     if (result.status === "error") {
//         throw new Error(result.message);
//     }
// }