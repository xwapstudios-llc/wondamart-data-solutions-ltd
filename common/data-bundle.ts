
// All possible networks
// `network` is a discriminating union.
// `mtn`, `telecel` and `at`
export type Network = "mtn" | "telecel" | "at";

export interface DataBundle {
    enabled: boolean;

    // The network of this data bundle
    network: Network,

    // The exact amount of data in GB. No decimals
    dataPackage: {
        data: number,
        minutes?: number,
        sms?: number
    },

    // The number of days this data will be valid for
    validity: number,

    // The price of this data bundle in XOF
    price: number,

    // A unique identifier for this data bundle
    id: string,

    // The name of this data bundle
    // This is optional because some bundles might not have names
    name?: string
}
