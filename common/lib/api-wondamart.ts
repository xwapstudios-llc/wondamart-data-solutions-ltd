import axios from "axios";
import {api_key} from "../../server/common/express/api_key";
import type {HTTPResponse} from "@common/types/request";
import {auth} from "@common/lib/auth";

async function api_wondamart_client() {
    return axios.create({
        baseURL: "https://api.wondamartgh.com",
        timeout: 15000,
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "authorization": `Bearer ${api_key}`,
            "user-id": auth.currentUser?.uid,
            "user-token": await auth.currentUser?.getIdToken()
        },
    });
}

type ApiWondamart =
    "/"
    | "/buy"
    | "/buy/data-bundle"
    | "/buy/afa-bundle"
    | "/buy/result-checker"
    | "/new/user"
    | "/user"
    | "/user/register-agent"
    | "/user/activate"
    | "/user/verify-email"
    | "/user/update-phone"
    | "/user/delete"
    | "/admin"
    | "/admin/first-admin"
    | "/admin/make-admin"
    | "/admin/update-admin"
    | "/admin/revoke-admin"
    | "/wondamart-gh/settings/init"
    | "/wondamart-gh/data-bundles/create"
    | "/wondamart-gh/data-bundles/delete"
    | "/status"
    | "/status/tx-watcher"
    | "/deposit"
    | "/deposit/paystack"
    | "/deposit/paystack/submit-otp"
    | "/deposit/send"
    | "/deposit/momo"
    | "/callbacks/paystack"
    | "/webhooks/paystack"
;


const api_wondamart_req = async (url: ApiWondamart, data: any): Promise<HTTPResponse> => {
    const client = await api_wondamart_client();
    const response = await client.post(
        url as unknown as string,
        data
    );
    return Promise.resolve(response.data as HTTPResponse);
}

export {
    api_wondamart_req
}