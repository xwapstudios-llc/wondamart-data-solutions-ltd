// compute-server/src/paystack/core.ts
import config from "../config";
import axios from "axios";

interface PayStackOptions {
    hostname: string;
    port: number;
    path: string;
    method: string;
    headers: {
        Authorization: string;
        'Content-Type'?: string;
    }
}

const paystackOptions = {
    post: (path: string): PayStackOptions => {
        return {
            hostname: 'api.paystack.co',
            port: 443,
            path: path,
            method: 'POST',
            headers: {
                Authorization: `Bearer ${config.paystack_production_key}`,
                'Content-Type': 'application/json'
            }
        }
    },
    get: (path: string): PayStackOptions => {
        return {
            hostname: 'api.paystack.co',
            port: 443,
            path: path,
            method: 'GET',
            headers: {
                Authorization: `Bearer ${config.paystack_production_key}`,
            }
        }
    }
}

interface PayStackResponse {
    status: boolean;
    message: string;
    data: {
        "amount"?: number,
        "channel"?: "mobile_money" | "card" | "bank" | string,
        "created_at"?: string,
        "currency"?: "GHS" | string,
        "domain"?: "live" | string,
        "fees"?: number,
        "gateway_response"?: "Approved" | string,
        "id"?: number,
        "ip_address"?: string,
        "message"?: string,
        "paid_at"?: string,
        "reference": string,
        "status": "success" | "pending" | "send_otp" | "send_pin" | "pay_offline" | string,
        "ussd_code"?: string,
        "transaction_date"?: string,
        authorization?: {
            "authorization_code"?: string,
            "bank"?: string,
            "bin"?: string,
            "brand"?: string,
            "channel"?: string,
            "country_code"?: string,
            "exp_month"?: number,
            "exp_year"?: number,
            "last4"?: string,
            "reusable"?: boolean,
            "account_name"?: string
        };
        customer?: {
            "customer_code"?: string,
            "email"?: string,
            "id"?: number,
            "risk_action"?: string | "default";
            "last_name"?: string,
            "metadata"?: any,
            "first_name"?: string,
            "phone"?: string,
        };
    };
}

interface PayStackRequestResult {
    res?: PayStackResponse;
    error: object | null;
}

const paystackRequest = async (params: string, options: PayStackOptions): Promise<PayStackRequestResult> => {
    try {
        const url = `https://${options.hostname}${options.path}`;
        const resp = await axios.request({
            method: options.method as any,
            url,
            headers: options.headers,
            data: params
        });

        const parsed = resp.data as PayStackResponse;
        console.log("Paystack response received", parsed);
        return { res: parsed, error: null };
    } catch (err) {
        console.log("Paystack request error", err);
        return { res: undefined, error: (err as object) };
    }
}

export {
    paystackOptions, paystackRequest, PayStackRequestResult
}
