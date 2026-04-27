import { Axios, type AxiosInstance } from "axios";

type Method = "get" | "post" | "put" | "delete";

export const req = async (method: Method, url: string, payload: any, headers: Record<string, string>) => {
  const response = await fetch(url, {
    method,
    headers,
    body: payload ? JSON.stringify(payload) : null,
  });
  return await response.json();
};

export interface RouteResponse<T> {
  status_code: number;
  message?: string;
  data: T;
}

export class Client {
  baseURL: string;
  headers: Record<string, string>;
  client: Axios;
  // client: AxiosInstance

  constructor(baseURL: string, headers: Record<string, string>) {
    this.baseURL = baseURL;
    this.headers = headers;

    this.client = new Axios({
      baseURL: this.baseURL,
      headers: this.headers,
    })
  }

  async get<T, R>(route: { path: string; payload: T }): Promise<RouteResponse<R>> {
    const response = await this.client.get(route.path);
    return Promise.resolve(response.data);
  }

  async post<T, R>(route: { path: string; payload: T }): Promise<RouteResponse<R>> {
    const response = await this.client.post(route.path);
    return Promise.resolve(response.data);
  }

  async put<T, R>(route: { path: string; payload: T }): Promise<RouteResponse<R>> {
    const response = await this.client.put(route.path, route.payload);
    return Promise.resolve(response.data);
  }

  async delete<T, R>(route: { path: string; payload: T }): Promise<RouteResponse<R>> {
    const response = await this.client.delete(route.path, { data: route.payload });
    return Promise.resolve(response.data);
  }
}

export type RouteFunction<T, R> = (payload: T) => Promise<RouteResponse<R>>;
