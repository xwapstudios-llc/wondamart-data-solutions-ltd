import { client } from "../client.js";
import { buildQuery } from "../utils/query-builder.js";

// /admin/api-provider
interface ApiProvider {
  api_id: string,
  name: string,
  url: string,
  purpose: string,
  api_key: string,
  secret_key?: string,
  webhook_url?: string,
  is_active: boolean,
  timeout_seconds: number,
  configuration: object,
  created_at?: string,
  updated_at?: string,
}

interface AdminApiProviderGetReq {
  api_id: string,
}

interface AdminApiProviderPostReq {
  api_id: string,
  name: string,
  url: string,
  purpose: string,
  api_key: string,
  secret_key?: string,
  webhook_url?: string,
  is_active: boolean,
  timeout_seconds?: number,
  configuration: object,
}

interface AdminApiProviderPutReq {
  api_id: string,
  name?: string,
  url?: string,
  purpose?: string,
  api_key?: string,
  secret_key?: string,
  webhook_url?: string,
  is_active?: boolean,
  timeout_seconds?: number,
  configuration?: object,
}

interface AdminApiProviderDeleteReq {
  api_id: string,
}

export const admin = {
  apiProvider: {
    get: async (payload: AdminApiProviderGetReq) => client.get<undefined, ApiProvider>({ path: `/admin/api-provider?${buildQuery(payload)}` }),
    post: async (payload: AdminApiProviderPostReq) => client.post<AdminApiProviderPostReq, ApiProvider>({ path: "/admin/api-provider", payload }),
    put: async (payload: AdminApiProviderPutReq) => client.put<AdminApiProviderPutReq, ApiProvider>({ path: "/admin/api-provider", payload }),
    delete: async (payload: AdminApiProviderDeleteReq) => client.delete<AdminApiProviderDeleteReq, void>({ path: "/admin/api-provider", payload }),
  },
}
