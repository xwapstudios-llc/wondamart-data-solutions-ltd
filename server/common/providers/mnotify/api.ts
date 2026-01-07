// src/services/mnotify.ts
import axios, { AxiosInstance } from "axios";
import config from "../../config";

export interface SendSmsPayload {
    recipients: string[];
    message: string;
    sender?: string;
    is_schedule?: boolean;
    schedule_date?: string; // YYYY-MM-DD
    schedule_time?: string; // HH:mm
}

export interface MnotifyResponse {
    code: string;
    message: string;
    status: string;
    data?: unknown;
}

class MnotifyClient {
    private client: AxiosInstance;
    private apiKey: string;
    private senderId: string;

    constructor() {
        this.apiKey = config.mnotify_api_key;
        this.senderId = config.mnotify_sender_id;

        if (!this.apiKey) {
            throw new Error("MNOTIFY_API_KEY is missing");
        }

        this.client = axios.create({
            baseURL: "https://api.mnotify.com/api",
            timeout: 15000,
            headers: {
                "Content-Type": "application/json",
            },
        });
    }

    async sendSms(payload: SendSmsPayload): Promise<MnotifyResponse> {
        const body = {
            recipient: payload.recipients,
            sender: payload.sender ?? "Wondamart Data Solutions Ltd.",
            message: payload.message,
            is_schedule: payload.is_schedule ?? false,
            schedule_date: payload.schedule_date,
            schedule_time: payload.schedule_time,
        };

        const response = await this.client.post<MnotifyResponse>(
            `/sms/quick?key=${this.apiKey}`,
            body
        );

        return response.data;
    }

    async getBalance(): Promise<MnotifyResponse> {
        const response = await this.client.get<MnotifyResponse>(
            `/balance?key=${this.apiKey}`
        );
        return response.data;
    }
}

export const mnotifyClient = new MnotifyClient();