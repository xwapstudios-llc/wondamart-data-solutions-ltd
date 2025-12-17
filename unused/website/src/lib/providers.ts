import {NetworkId} from "@common/types/data-bundle";

export interface NetworkProvider {
    id: NetworkId;
    name: string;
    logoUrl: string;
}

const mtn: NetworkProvider = {
    id: 'mtn',
    name: 'MTN',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/6/62/MTN-Logo.png',
};
const telecel: NetworkProvider = {
    id: 'telecel',
    name: 'Telecel',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/2e/Telecel_logo.png',
};
const airtelTigo: NetworkProvider = {
    id: 'airteltigo',
    name: 'AirtelTigo',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/7e/AirtelTigo_logo.png',
};

const networkProviders: Map<string, NetworkProvider> = new Map<string, NetworkProvider>();
[mtn, telecel, airtelTigo].forEach((provider: NetworkProvider) => {
    networkProviders.set(provider.id, provider);
});

export function getProviderById(id: string): NetworkProvider | undefined {
    return networkProviders.get(id);
}
export function getAllProviders(): NetworkProvider[] {
    return [mtn, telecel, airtelTigo];
}
