import { client } from "../client.js";

// /
interface HomeResponse {
  service: string,
  status: string,
  timestamp: string,
}

export const home = {
  get: async () => client.get<undefined, HomeResponse>({ path: "/" }),
}
