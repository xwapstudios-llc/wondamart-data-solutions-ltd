import { client } from "../client.js";

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

export const admin = {
  apiProvider: {
    get: async (payload: AdminApiProviderGetReq) => client.get<null, ApiProvider>({ path: `/admin/api-provider?${new URLSearchParams(payload as any)}`, payload: null }),
    post: async (payload: AdminApiProviderPostReq) => client.post<AdminApiProviderPostReq, ApiProvider>({ path: "/admin/api-provider", payload }),
    put: async (payload: AdminApiProviderPutReq) => client.put<AdminApiProviderPutReq, ApiProvider>({ path: "/admin/api-provider", payload }),
    delete: async (payload: AdminApiProviderGetReq) => client.delete<AdminApiProviderGetReq, void>({ path: "/admin/api-provider", payload }),
  },
}
