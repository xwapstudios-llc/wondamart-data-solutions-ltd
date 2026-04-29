import { Axios } from "axios";

type Method = "get" | "post" | "put" | "delete";

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

  /**
   * GET request with query parameters
   * Query params should be included in the path as URL parameters
   */
  async get<T, R>(route: { path: string; payload?: T }): Promise<RouteResponse<R>> {
    const response = await this.client.get(route.path);
    return Promise.resolve(response.data);
  }

  /**
   * POST request with JSON body payload
   */
  async post<T, R>(route: { path: string; payload: T }): Promise<RouteResponse<R>> {
    const response = await this.client.post(route.path, route.payload);
    return Promise.resolve(response.data);
  }

  /**
   * PUT request with JSON body payload
   */
  async put<T, R>(route: { path: string; payload: T }): Promise<RouteResponse<R>> {
    const response = await this.client.put(route.path, route.payload);
    return Promise.resolve(response.data);
  }

  /**
   * DELETE request with JSON body payload
   */
  async delete<T, R>(route: { path: string; payload: T }): Promise<RouteResponse<R>> {
    const response = await this.client.delete(route.path, { data: route.payload });
    return Promise.resolve(response.data);
  }
}

