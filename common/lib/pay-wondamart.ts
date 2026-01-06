import axios from "axios";
import {api_key} from "../../server/common/express/api_key";
import type {HTTPResponse} from "@common/types/request";

async function pay_wondamart_client() {
    return axios.create({
        baseURL: "https://pay.wondamartgh.com",
        timeout: 15000,
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "authorization": `Bearer ${api_key}`
        },
    });
}

type PayWondamart =
    "/"
    | "/deposit/paystack"
    | "/deposit/paystack/submit-otp"
    | "/callbacks/paystack"
    | "/webhooks/paystack"

    | "/deposit/send"
    | "/deposit/momo"

const pay_wondamart_req = async (url: PayWondamart, data: any): Promise<HTTPResponse> => {
    const client = await pay_wondamart_client();
    const response = await client.post(
        url as unknown as string,
        data
    );
    return Promise.resolve(response.data as HTTPResponse);
}

export {
    pay_wondamart_req
}