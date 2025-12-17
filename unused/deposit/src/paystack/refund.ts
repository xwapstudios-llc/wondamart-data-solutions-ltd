import {paystackOptions, paystackRequest} from "./core";

export const refund = {
    create: async (params: { transaction: string; amount?: number; customer_note?: string, merchant_note: string }) => {
        const res = await paystackRequest(JSON.stringify(params), paystackOptions.post("/refund"));
        if (res.error) {
            console.error(res.error);
        } else {
            console.log("Successfully created refund:");
            console.log(res);
        }
    },
    retry: async (params: { id: number; refund_account_details: {currency: string, account_number: string, bank_id: string} }) => {
        const res = await paystackRequest(JSON.stringify(params), paystackOptions.post(`/refund/retry_with_customer_details/${params.id}`));
        if (res.error) {
            console.error(res.error);
        } else {
            console.log("Successfully retried refund:");
            console.log(res);
        }
    },

    list_refunds: async (params?: { perPage?: number; page?: number; transaction?: string, currency?: string, from?: string, to?: string }) => {
        let path = "/refund";
        const queryParams: string[] = [];
        if (params) {
            if (params.perPage) {
                queryParams.push(`perPage=${params.perPage}`);
            }
            if (params.page) {
                queryParams.push(`page=${params.page}`);
            }
            if (params.transaction) {
                queryParams.push(`transaction=${params.transaction}`);
            }
            if (params.currency) {
                queryParams.push(`currency=${params.currency}`);
            }
            if (params.from) {
                queryParams.push(`from=${params.from}`);
            }
            if (params.to) {
                queryParams.push(`to=${params.to}`);
            }
            if (queryParams.length > 0) {
                path += `?${queryParams.join("&")}`;
            }
        }
        const res = await paystackRequest("", paystackOptions.get(path));
        if (res.error) {
            console.error(res.error);
        } else {
            console.log("Successfully listed refunds:");
            console.log(res);
        }
    },

    get: async (refundId: number) => {
        const res = await paystackRequest("", paystackOptions.get(`/refund/${refundId}`));
        if (res.error) {
            console.error(res.error);
        } else {
            console.log("Successfully retrieved refund:");
            console.log(res);
        }
    }
}