import { client } from "../client.js";
import { type AgentStore } from "../common.js";

// /guest/store
interface GuestStoreGetReq {
  store_id: string,
}

// /guest/buy
interface GuestBuyPostReq {
  store_id: string,
  bundle_id: string,
  phone_number: string,
}
interface GuestBuyPostRes { }

// /guest/track
interface GuestTrackGetReq {
  phone_number: string,
}
interface GuestTrackGetRes {}

export const guest = {
  store: async (params: GuestStoreGetReq) => client.get<null, AgentStore>({path: `/guest/store?${new URLSearchParams(params as any)}`, payload: null }),
  buy: async (payload: GuestBuyPostReq) => client.post<GuestBuyPostReq, GuestBuyPostRes>({path: "/guest/buy", payload}),
  track: async (params: GuestTrackGetReq) => client.get<null, GuestTrackGetRes>({path: `/guest/track?${new URLSearchParams(params as any)}`, payload: null }),
}
