import axios, { AxiosInstance } from "axios";

/** =========================
 * Core Types
 * ========================= */

export type DataMartNetwork = "TELECEL" | "YELLO" | "AT_PREMIUM";

export type ApiStatus = "success" | "error";

export interface ApiSuccess<T> {
    status: "success";
    data: T;
}

export interface ApiError {
    status: "error";
    message: string;
    details?: unknown;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

/** =========================
 * Purchase
 * ========================= */

export interface PurchasePayload {
    phoneNumber: string;
    network: DataMartNetwork;
    capacity: string; // GB as string per API contract
    gateway?: "wallet";
}

export interface PurchaseResult {
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

export interface DataPackage {
    capacity: string;
    mb: string;
    price: string;
    network: DataMartNetwork;
}

export type AllNetworkPackages = Record<DataMartNetwork, DataPackage[]>;

/** =========================
 * Transactions
 * ========================= */

export interface Transaction {
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

export interface TransactionsResponse {
    transactions: Transaction[];
    pagination: {
        currentPage: number;
        totalPages: number;
        totalItems: number;
    };
}

/** =========================
 * Referral Bonus
 * ========================= */

export interface ReferralBonusResult {
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
        payload: PurchasePayload
    ): Promise<ApiResponse<PurchaseResult>> {
        const { data } = await this.http.post<ApiResponse<PurchaseResult>>(
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
    ): Promise<ApiResponse<DataPackage[] | AllNetworkPackages>> {
        const { data } = await this.http.get<
            ApiResponse<DataPackage[] | AllNetworkPackages>
        >("/data-packages", { params: network ? { network } : undefined });
        return data;
    }

    /** =========================
     * Transactions
     * ========================= */

    async getTransactions(
        page = 1,
        limit = 20
    ): Promise<ApiResponse<TransactionsResponse>> {
        const { data } = await this.http.get<ApiResponse<TransactionsResponse>>(
            "/transactions",
            { params: { page, limit } }
        );
        return data;
    }

    /** =========================
     * Referral Bonus
     * ========================= */

    async claimReferralBonus(): Promise<ApiResponse<ReferralBonusResult>> {
        const { data } = await this.http.post<ApiResponse<ReferralBonusResult>>(
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


async function main() {
    const datamart = new DataMartClient({
        apiKey: process.env.DATAMART_API_KEY!,
    });

    const result = await datamart.purchaseData({
        phoneNumber: normalizeGhanaPhone("0551234567"),
        network: "TELECEL",
        capacity: assertCapacity(5),
    });

    if (result.status === "error") {
        throw new Error(result.message);
    }
}