import axios, {type AxiosInstance} from "axios";
import {api_key} from "../../server/common/express/api_key";
import {type HTTPResponse} from "@common/types/request";
import {auth} from "@common/lib/auth";

type ApiWondamart =
    | "/"
    | "/buy/data-bundle"
    | "/buy/afa-bundle"
    | "/buy/result-checker"
    | "/admin/first-admin"
    | "/admin/make-admin"
    | "/admin/update-admin"
    | "/admin/revoke-admin"
    | "/admin/data-bundle/create"
    | "/admin/data-bundle/delete"
    | "/admin/settings/init"
    | "/user/activate-account"
    | "/user/delete"
    | "/user/register-agent"
    | "/user/update-phone-number"
    | "/user/auth/complete-email-verification"
    | "/user/auth/start-email-verification"
    | "/deposit/momo"
    | "/deposit/send"
    | "/deposit/paystack"
    | "/deposit/paystack-submit-otp"
    | "/webhooks/hendylinks"
    | "/webhooks/paystack"
    | "/callbacks/paystack"
    | "/new/user"
    ;

class WondamartApiClient {
    private axios: AxiosInstance;

    constructor(baseUrl: string) {
        this.axios = axios.create({
            baseURL: baseUrl,
            timeout: 15000,
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "authorization": `Bearer ${api_key}`,
            }
        });
    }

    async request(url: ApiWondamart, data?: any): Promise<HTTPResponse> {
        const user = auth.currentUser;
        if (!user) {
            throw new Error("Auth not ready");
        }

        const token = await user.getIdToken();

        const response = await this.axios.post(url, data, {
            headers: {
                "user-id": user.uid,
                "user-token": token,
            }
        });

        return response.data as HTTPResponse;
    }

    async requestWithoutToken(url: ApiWondamart, data?: any): Promise<HTTPResponse> {
        const response = await this.axios.post(url, data);
        return response.data as HTTPResponse;
    }
}

let baseUrl = "https://api.wondamartgh.com"
baseUrl = "http://localhost:3180"

const wondamart_api = new WondamartApiClient(baseUrl);
const wondamart_api_client = async (url: ApiWondamart, data?: any): Promise<HTTPResponse> => {
    return wondamart_api.request(url, data);
}
const wondamart_api_client_without_token = async (url: ApiWondamart, data?: any): Promise<HTTPResponse> => {
    return wondamart_api.requestWithoutToken(url, data);
}

export {
    wondamart_api_client,
    wondamart_api_client_without_token
}