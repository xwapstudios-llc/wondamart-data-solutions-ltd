import { client } from "../client.js";
import { buildQuery } from "../utils/query-builder.js";

// /user
interface UserGetReq {
  uid: number,
}
interface User {
  uid?: number,
  email?: string,
  phone_number?: string,
  first_name?: string,
  last_name?: string,
  profile_photo_url?: string,
  is_active: boolean,
  email_verified: boolean,
  phone_verified: boolean,
  last_login?: string,
  last_activity?: string,
  metadata: object,
  created_at?: string,
  updated_at?: string,
}

interface UserPutReq {
  uid: number,
  [key: string]: any,
}

interface UserDeleteReq {
  uid: number,
}

// /user/register
interface UserRegisterPostReq {
  first_name: string,
  last_name: string,
  email: string,
  phone_number: string,
}

// /user/data-bundle
interface UserDataBundleGetReq {
  network?: string,
  bundle_id?: string,
  validity?: number,
  enabled?: boolean,
}

interface UserDataBundlePostReq {
  phone: string,
  bundle_id: string,
}

// /user/afa-bundle
interface UserAfaBundlePostReq {
  full_name: string,
  ghana_card: string,
  occupation: string,
  contact: string,
  location: string,
}

export const user = {
  get: async (payload: UserGetReq) => client.get<undefined, User>({ path: `/user?${buildQuery(payload)}` }),
  put: async (payload: UserPutReq) => client.put<UserPutReq, User>({ path: "/user", payload }),
  delete: async (payload: UserDeleteReq) => client.delete<UserDeleteReq, void>({ path: "/user", payload }),
  register: async (payload: UserRegisterPostReq) => client.post<UserRegisterPostReq, User>({ path: "/user/register", payload }),
  dataBundle: {
    get: async (payload: UserDataBundleGetReq) => client.get<undefined, any>({ path: `/user/data-bundle?${buildQuery(payload)}` }),
    post: async (payload: UserDataBundlePostReq) => client.post<UserDataBundlePostReq, void>({ path: "/user/data-bundle", payload }),
  },
  afaBundle: async (payload: UserAfaBundlePostReq) => client.post<UserAfaBundlePostReq, void>({ path: "/user/afa-bundle", payload }),
}
