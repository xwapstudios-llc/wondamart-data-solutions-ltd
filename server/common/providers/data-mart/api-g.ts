import axios, {AxiosInstance} from 'axios';

/**
 * Type Definitions for DataMart Ghana
 */

export type NetworkIdentifier = 'TELECEL' | 'YELLO' | 'AT_PREMIUM';
export type TransactionStatus = 'completed' | 'pending' | 'failed';

export interface DataPackage {
    capacity: string;
    mb: string;
    price: string;
    network: NetworkIdentifier;
}

export interface PurchaseRequest {
    phoneNumber: string;
    network: NetworkIdentifier;
    capacity: string; // Data capacity in GB (e.g., "5")
    gateway?: 'wallet';
}

export interface PurchaseResponse {
    status: 'success' | 'error';
    data?: {
        purchaseId: string;
        transactionReference: string;
        network: NetworkIdentifier;
        capacity: string;
        mb: string;
        price: number;
        remainingBalance: number;
    };
    message?: string;
    details?: any;
}

export interface ApiKeyInfo {
    id: string;
    name: string;
    key?: string;
    expiresAt: string;
}

/**
 * DataMart Ghana API Client
 */
export class DataMartClient {
    private client: AxiosInstance;

    constructor(apiKey: string) {
        this.client = axios.create({
            baseURL: 'https://api.datamartgh.shop/api/developer',
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': apiKey,
            },
        });
    }

    /**
     * Purchase mobile data for a phone number
     */
    async purchaseData(data: PurchaseRequest): Promise<PurchaseResponse> {
        const response = await this.client.post<PurchaseResponse>('/purchase', {
            gateway: 'wallet', // Default to wallet as per documentation
            ...data,
        });
        return response.data;
    }

    /**
     * Get available data packages.
     * @param network Optional network filter
     */
    async getDataPackages(network?: NetworkIdentifier): Promise<any> {
        const params = network ? {network} : {};
        const response = await this.client.get('/data-packages', {params});
        return response.data;
    }

    /**
     * Retrieve transaction history
     */
    async getTransactions(page: number = 1, limit: number = 20): Promise<any> {
        const response = await this.client.get('/transactions', {
            params: {page, limit},
        });
        return response.data;
    }

    /**
     * Generate a new API Key
     */
    async generateApiKey(name: string, expiresInDays?: number): Promise<ApiKeyInfo> {
        const response = await this.client.post('/generate-api-key', {name, expiresIn: expiresInDays});
        return response.data;
    }

    /**
     * Claim referral bonus
     */
    async claimReferralBonus(): Promise<any> {
        const response = await this.client.post('/claim-referral-bonus');
        return response.data;
    }
}


async function main() {
    const dmClient = new DataMartClient('your_datamart_api_key');

    try {
        // 1. Check what packages are available for MTN
        const packages = await dmClient.getDataPackages('YELLO');
        console.log("Available Yello Bundles:", packages.data);

        // 2. Buy a 5GB bundle
        const receipt = await dmClient.purchaseData({
            phoneNumber: '0551234567',
            network: 'YELLO',
            capacity: '5'
        });

        if (receipt.status === 'success') {
            console.log(`Transaction ID: ${receipt.data?.purchaseId}`);
        }
    } catch (err) {
        console.error("DataMart purchase failed", err);
    }
}