import axios, {AxiosInstance} from 'axios';

/**
 * Interfaces for HendyLinks API
 */

export type NetworkType = 'MTN' | 'Telecel' | 'AirtelTigo';

export interface ApiResponse {
    success: boolean;
    message: string;
}

export interface OrderResponse extends ApiResponse {
    order_id?: number;
}

export interface BalanceResponse {
    success: boolean;
    balance: number;
    currency: string;
}

export interface CreateOrderRequest {
    recipient_phone: string;
    data_plan_id?: number;
    network?: NetworkType;
    size_gb?: number;
}

export interface OrderHistoryParams {
    limit?: number;
    offset?: number;
}

/**
 * HendyLinks API Client
 */
export class HendyLinksClient {
    private client: AxiosInstance;

    constructor(apiKey: string, baseUrl: string = 'https://hendylinks.net') {
        this.client = axios.create({
            baseURL: baseUrl,
            headers: {
                'Content-Type': 'application/json',
                'X-API-KEY': apiKey,
            },
        });

        // Handle common errors based on status codes
        this.client.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response) {
                    const {status, data} = error.response;
                    console.error(`API Error ${status}: ${data.message || 'Unknown error'}`);
                }
                return Promise.reject(error);
            }
        );
    }

    /**
     * Create a new data order
     */
    async createOrder(orderData: CreateOrderRequest): Promise<OrderResponse> {
        const response = await this.client.post<OrderResponse>('/api/orders', orderData);
        return response.data;
    }

    /**
     * Get order history
     */
    async getOrders(params: OrderHistoryParams = {limit: 20, offset: 0}): Promise<any> {
        const response = await this.client.get('/api/orders', {params});
        return response.data;
    }

    /**
     * Check wallet balance
     */
    async getBalance(): Promise<BalanceResponse> {
        const response = await this.client.get<BalanceResponse>('/api/balance');
        return response.data;
    }

    /**
     * Deposit funds to wallet
     */
    async deposit(amount: number): Promise<ApiResponse> {
        const response = await this.client.post<ApiResponse>('/api/deposit', {amount});
        return response.data;
    }
}


async function main() {
    const api = new HendyLinksClient('33af8978715d6321008e22802e2f9fa9fb16cc116bed040b');

    try {
        // 1. Check Balance
        const balanceInfo = await api.getBalance();
        console.log(`Current Balance: ${balanceInfo.balance}`);

        // 2. Place Order
        const order = await api.createOrder({
            recipient_phone: "0241234567",
            network: "MTN",
            size_gb: 5
        });

        if (order.success) {
            console.log(`Success! Order ID: ${order.order_id}`);
        }
    } catch (error) {
        console.error("Transaction failed");
    }
}