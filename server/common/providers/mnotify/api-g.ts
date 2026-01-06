import axios, { AxiosInstance } from 'axios';

/**
 * Types for mNotify API Requests and Responses
 */
export interface MNotifySmsPayload {
    recipient: string[];
    sender: string;
    message: string;
    is_schedule?: boolean;
    schedule_date?: string; // YYYY-MM-DD hh:mm
    sms_type?: 'otp' | 'contact';
}

export interface MNotifyResponse<T = any> {
    status: 'success' | 'error';
    code: string;
    message: string;
    summary?: T;
}

export interface SmsSummary {
    _id: string;
    type: string;
    total_sent: number;
    contacts: number;
    total_rejected: number;
    numbers_sent: string[];
    credit_used: number;
    credit_left: number;
}

export class MNotifyClient {
    private client: AxiosInstance;
    private apiKey: string;
    private baseUrl = 'https://api.mnotify.com/api';

    constructor(apiKey: string) {
        this.apiKey = apiKey;
        this.client = axios.create({
            baseURL: this.baseUrl,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    /**
     * Send Quick Bulk SMS
     * @param data SMS details including recipients and message
     */
    async sendQuickSms(data: MNotifySmsPayload): Promise<MNotifyResponse<SmsSummary>> {
        try {
            const response = await this.client.post<MNotifyResponse<SmsSummary>>(
                `/sms/quick`,
                {
                    ...data,
                    is_schedule: data.is_schedule || false,
                    schedule_date: data.schedule_date || "",
                },
                {
                    params: { key: this.apiKey }
                }
            );
            return response.data;
        } catch (error: any) {
            return error.response?.data || { status: 'error', message: error.message };
        }
    }

    /**
     * Check SMS Balance
     */
    async getBalance(): Promise<MNotifyResponse<{ balance: number }>> {
        try {
            const response = await this.client.get<MNotifyResponse<{ balance: number }>>(
                `/balance`,
                { params: { key: this.apiKey } }
            );
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || "Failed to fetch balance");
        }
    }

    /**
     * Register a new Sender ID
     * @param senderName (Max 11 characters)
     * @param purpose Reason for registration
     */
    async registerSenderId(senderName: string, purpose: string): Promise<MNotifyResponse> {
        try {
            const response = await this.client.post(
                `/senderid/register`,
                { sender_name: senderName, purpose },
                { params: { key: this.apiKey } }
            );
            return response.data;
        } catch (error: any) {
            return error.response?.data;
        }
    }
}
