import { client } from "../client.js";

// /
interface HomeResponse {
  service: string,
  status: string,
  timestamp: string,
}

export const home = {
  get: async () => client.get<any, HomeResponse>({ path: "/", payload: null }),
}
