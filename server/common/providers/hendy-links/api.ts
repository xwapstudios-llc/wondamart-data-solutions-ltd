import axios, { AxiosInstance } from "axios";
import {NetworkId} from "@common/types/data-bundle";
import {RouteHandler} from "../../express";
import config from "../../config";

/** =========================
 * Core Types & Interfaces
 * ========================= */

export type HendyLinksNetwork = "MTN" | "Telecel" | "AirtelTigo";

export interface HendyLinksApiSuccess<T = unknown> {
    success: true;
    message?: string;
    data?: T;
}

export interface HendyLinksApiError {
    success: false;
    message: string;
}

export type HendyLinksApiResponse<T = unknown> = HendyLinksApiSuccess<T> | HendyLinksApiError;

/** =========================
 * Orders
 * ========================= */

export interface HendyLinksCreateOrderByPlanId {
    recipient_phone: string;
    data_plan_id: number;
}

export interface HendyLinksCreateOrderByNetwork {
    recipient_phone: string;
    network: HendyLinksNetwork;
    size_gb: number;
}

export type HendyLinksCreateOrderPayload = HendyLinksCreateOrderByPlanId | HendyLinksCreateOrderByNetwork;

export interface HendyLinksOrder {
    id: number;
    status: "processing" | "completed" | "failed";
    message: string;
    amount: number;
    recipient_phone: string;
    plan_name: string;
    network: HendyLinksNetwork;
    size_mb: number;
    created_at: string;
    updated_at: string;
}

export interface HendyLinksCreateOrderResponse {
    order_id: number;
}

export interface HendyLinksGetOrdersParams {
    limit?: number;
    offset?: number;
}

/** =========================
 * Wallet
 * ========================= */

export interface HendyLinksBalanceResponse {
    balance: number;
    currency?: string;
}

export interface HendyLinksDepositPayload {
    amount: number;
}

/** =========================
 * Webhooks
 * ========================= */

export interface HendyLinksWebhookPayload {
    event: "order.status_changed";
    timestamp: string;
    order: HendyLinksOrder;
    user: {
        name: string;
        phone: string;
    };
}

/** =========================
 * Client Configuration
 * ========================= */

export interface HendyLinksClientConfig {
    apiKey: string;
    baseURL?: string;
    timeoutMs?: number;
}

/** =========================
 * HendyLinks API Client
 * ========================= */

class HendyLinksClient {
    private http: AxiosInstance;

    constructor(config: HendyLinksClientConfig) {
        if (!config.apiKey) {
            throw new Error("API key is required");
        }

        this.http = axios.create({
            baseURL: config.baseURL ?? "https://hendylinks.net",
            timeout: config.timeoutMs ?? 15000,
            headers: {
                "Content-Type": "application/json",
                "X-API-KEY": config.apiKey,
            },
        });
    }

    /** =========================
     * Orders
     * ========================= */

    async createOrder(
        payload: HendyLinksCreateOrderPayload
    ): Promise<HendyLinksApiResponse<HendyLinksCreateOrderResponse>> {
        const { data } = await this.http.post<HendyLinksApiResponse<HendyLinksCreateOrderResponse>>(
            "/api/orders",
            payload
        );
        return data;
    }

    async getOrders(
        params?: HendyLinksGetOrdersParams
    ): Promise<HendyLinksApiResponse<HendyLinksOrder[]>> {
        const { data } = await this.http.get<HendyLinksApiResponse<HendyLinksOrder[]>>(
            "/api/orders",
            { params }
        );
        return data;
    }

    /** =========================
     * Wallet
     * ========================= */

    async getBalance(): Promise<HendyLinksApiResponse<HendyLinksBalanceResponse>> {
        const { data } = await this.http.get<HendyLinksApiResponse<HendyLinksBalanceResponse>>(
            "/api/balance"
        );
        return data;
    }

    async deposit(
        payload: HendyLinksDepositPayload
    ): Promise<HendyLinksApiResponse<null>> {
        const { data } = await this.http.post<HendyLinksApiResponse<null>>(
            "/api/deposit",
            payload
        );
        return data;
    }
}

/** =========================
 * Utilities
 * ========================= */

export function normalizePhone(phone: string): string {
    if (/^0\d{9}$/.test(phone)) return phone;
    if (/^\d{9}$/.test(phone)) return `0${phone}`;
    if (/^233\d{9}$/.test(phone)) return `0${phone.slice(3)}`;
    throw new Error("Invalid phone number format");
}

export function assertPositiveAmount(amount: number): void {
    if (amount <= 0) throw new Error("Amount must be greater than zero");
}

export function networkID_to_hendylinks_network(network: NetworkId): HendyLinksNetwork {
    switch (network) {
        case "mtn": return "MTN"
        case "telecel": return "Telecel"
        case "airteltigo": return "AirtelTigo"
        default: throw new Error("Network ID is required");
    }
}

// async function main() {
//     const client = new HendyLinksClient({
//         apiKey: process.env.HENDYLINKS_API_KEY!,
//     });
//
//     const order = await client.createOrder({
//         recipient_phone: normalizePhone("0241234567"),
//         network: "MTN",
//         size_gb: 5,
//     });
//
//     if (!order.success) {
//         throw new Error(order.message);
//     }
//
// }


export const hendylinks_client = new HendyLinksClient({
    apiKey: config.hendylinks_api_key
});