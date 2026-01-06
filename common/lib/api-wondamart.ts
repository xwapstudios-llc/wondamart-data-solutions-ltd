import axios from "axios";
import {api_key} from "../../server/common/express/api_key";
import type {HTTPResponse} from "@common/types/request";

async function api_wondamart_client() {
    return axios.create({
        baseURL: "https://api.wondamartgh.com",
        timeout: 15000,
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "authorization": `Bearer ${api_key}`
        },
    });
}

type ApiWondamart =
    "/"
    | "/buy/data-bundle"
    | "/buy/afa-bundle"
    | "/buy/result-checker"
    | "/user/create"
    | "/user/register-agent"
    | "/user/activate"
    | "/user/verify-email"
    | "/user/update-phone"
    | "/user/delete"
    | "/admin/first-admin"
    | "/admin/make-admin"
    | "/admin/update-admin"
    | "/admin/revoke-admin"
    | "/settings/init"
    | "/data-bundles/create"
    | "/data-bundles/delete"
    | "/tasks/auto-fail-deposits"
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