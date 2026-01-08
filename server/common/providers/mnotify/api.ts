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
        return {
            code: '200',
            message: 'SMS sent successfully',
            status: 'success',
            data: {
                recipients: payload.recipients,
                message: payload.message,
                sender: payload.sender ?? this.senderId,
                is_schedule: payload.is_schedule ?? false,
                schedule_date: payload.schedule_date ?? '',
                schedule_time: payload.schedule_time ?? ''
            }
        };
        // const params = new URLSearchParams({
        //     key: this.apiKey,
        //     recipient: payload.recipients.join(','),
        //     sender: payload.sender ?? this.senderId,
        //     message: payload.message,
        //     is_schedule: (payload.is_schedule ?? false).toString(),
        //     schedule_date: payload.schedule_date ?? '',
        //     schedule_time: payload.schedule_time ?? ''
        // });
        //
        // const response = await this.client.post<MnotifyResponse>(
        //     `/sms/quick?${params.toString()}`
        // );
        //
        // return response.data;
    }

    async getBalance(): Promise<MnotifyResponse> {
        const params = new URLSearchParams({ key: this.apiKey });
        const response = await this.client.get<MnotifyResponse>(
            `/balance/sms?${params.toString()}`
        );
        return response.data;
    }

    async checkSenderIdStatus(id: string): Promise<MnotifyResponse> {
        const params = new URLSearchParams({ key: this.apiKey, sender_name: id });
        const response = await this.client.post<MnotifyResponse>(
            `/senderid/status?${params.toString()}`
        );
        return response.data;
    }

    async registerSenderId(id: string, purpose: string): Promise<MnotifyResponse> {
        const params = new URLSearchParams({ key: this.apiKey, sender_name: id, purpose: purpose });
        const response = await this.client.post<MnotifyResponse>(
            `/senderid/register?${params.toString()}`
        );
        return response.data;
    }
}

export const mnotifyClient = new MnotifyClient();


`curl --location --request POST 'https://api.mnotify.com/api/senderid/status/?key=bDXVhXfaMneJxsL2jcJsfDm1a&sender_name=wondamart-server' --header 'Content-Type: application/json'
`