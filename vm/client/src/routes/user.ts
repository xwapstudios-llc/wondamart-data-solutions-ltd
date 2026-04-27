import { client } from "../client.js";

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

// /user/register
interface UserRegisterPostReq {
  first_name: string,
  last_name: string,
  email: string,
  phone_number: string,
}

// /user/data-bundle
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
  get: async (payload: UserGetReq) => client.get<null, User>({ path: `/user?${new URLSearchParams(payload as any)}`, payload: null }),
  register: async (payload: UserRegisterPostReq) => client.post<UserRegisterPostReq, User>({ path: "/user/register", payload }),
  dataBundle: async (payload: UserDataBundlePostReq) => client.post<UserDataBundlePostReq, void>({ path: "/user/data-bundle", payload }),
  afaBundle: async (payload: UserAfaBundlePostReq) => client.post<UserAfaBundlePostReq, void>({ path: "/user/afa-bundle", payload }),
}
