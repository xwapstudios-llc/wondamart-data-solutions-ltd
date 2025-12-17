import {paystackOptions, paystackRequest, PayStackRequestResult} from "./core";


export interface CreateChargeParams {
    amount: number;
    email: string;
    currency: "GHS";
    mobile_money: MobileMoneyParams;
    reference?: string;
    callback_url?: string;
}

interface MobileMoneyParams {
    phone: string;
    provider: "mtn" | "vod" | "atl";
}

export const charge = {
    create: async (params: CreateChargeParams): Promise<PayStackRequestResult> => {
        const res = await paystackRequest(JSON.stringify(params), paystackOptions.post("/charge"));
        if (res.error) {
            console.error(res.error);
        } else {
            console.log("Successfully created charge:");
            console.log(res);
        }
        return res;
    },
    submit_otp: async (reference: string, otp: string): Promise<PayStackRequestResult> => {
        const params = {
            "otp": otp,
            "reference": reference
        };
        const res = await paystackRequest(JSON.stringify(params), paystackOptions.post("/charge/submit_otp"));
        if (res.error) {
            console.error(res.error);
        } else {
            console.log("Successfully submitted OTP:");
            console.log(res);
        }
        return res;
    },
    submit_phone: async (reference: string, phone: string): Promise<PayStackRequestResult> => {
        const params = {
            "phone": phone,
            "reference": reference
        };
        const res = await paystackRequest(JSON.stringify(params), paystackOptions.post("/charge/submit_phone"));
        if (res.error) {
            console.error(res.error);
        } else {
            console.log("Successfully submitted phone:");
            console.log(res);
        }
        return res;
    },
    submit_birthday: async (reference: string, birthday: string): Promise<PayStackRequestResult> => {
        const params = {
            "birthday": birthday,
            "reference": reference
        };
        const res = await paystackRequest(JSON.stringify(params), paystackOptions.post("/charge/submit_birthday"));
        if (res.error) {
            console.error(res.error);
        } else {
            console.log("Successfully submitted birthday:");
            console.log(res);
        }
        return res;
    },
    submit_address: async (reference: string, address: string, city: string, state: string, zip_code: string): Promise<PayStackRequestResult> => {
        const params = {
            "address": address,
            "city": city,
            "state": state,
            "zip_code": zip_code,
            "reference": reference
        };
        const res = await paystackRequest(JSON.stringify(params), paystackOptions.post("/charge/submit_address"));
        if (res.error) {
            console.error(res.error);
        } else {
            console.log("Successfully submitted address:");
            console.log(res);
        }
        return res;
    },
    check_pending: async (reference: string): Promise<PayStackRequestResult> => {
        const res = await paystackRequest("", paystackOptions.get(`/charge/${reference}`));
        if (res.error) {
            console.error(res.error);
        } else {
            console.log("Successfully checked pending charge:");
            console.log(res);
        }
        return res;
    }
}