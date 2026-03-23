import {create} from "zustand";
import {persist} from "zustand/middleware"
import {type AgentStore} from "@common/agent";
import { Timestamp } from "firebase/firestore";


const genericStore: AgentStore = {
    storeId: "generic",
    storeName: "Wondamart Data Solutions",
    email: "wondamart@gmail.com",
    phoneNumber: "0000000000",
    logoUrl: "/logo/logo.png",
    openingTime: Timestamp.now(),
    closingTime: Timestamp.now(),
    dataBundles: [
        {
            id: "1",
            enabled: true,
            name: "MTNUP TO U",
            agentId: "generic",
            network: "mtn",
            dataPackage: {data: 100},
            agentPrice: 15,
            validity: 30
        },
        {
            id: "2",
            enabled: true,
            name: "MTNUPTOU",
            agentId: "generic",
            network: "mtn",
            dataPackage: {data: 100},
            agentPrice: 25,
            validity: 30
        },
        {
            id: "3",
            enabled: true,
            name: "MTNUPTOU",
            agentId: "generic",
            network: "mtn",
            dataPackage: {data: 100},
            agentPrice: 50,
            validity: 30
        },
        {
            id: "4",
            enabled: true,
            name: "MTNUPTOU",
            agentId: "generic",
            network: "mtn",
            dataPackage: {data: 100},
            agentPrice: 100,
            validity: 30
        },
        {
            id: "5",
            enabled: true,
            name: "MTNUPTOU",
            agentId: "generic",
            network: "mtn",
            dataPackage: {data: 100},
            agentPrice: 200,
            validity: 30
        },
        {
            id: "6",
            enabled: true,
            agentId: "generic",
            network: "mtn",
            dataPackage: {data: 100},
            agentPrice: 500,
            validity: 30
        },
        {
            id: "7",
            enabled: true,
            name: "MTNUPTOU",
            agentId: "generic",
            network: "mtn",
            dataPackage: {data: 100},
            agentPrice: 100,
            validity: 30
        },
        {
            id: "8",
            enabled: true,
            name: "MTNUPTOU",
            agentId: "generic",
            network: "mtn",
            dataPackage: {data: 100},
            agentPrice: 200,
            validity: 30
        },
        {
            id: "9",
            enabled: true,
            name: "MTNUPTOU",
            agentId: "generic",
            network: "mtn",
            dataPackage: {data: 100},
            agentPrice: 500,
            validity: 30
        },
        {
            id: "10",
            enabled: true,
            name: "MTNUPTOU",
            agentId: "generic",
            network: "mtn",
            dataPackage: {data: 100},
            agentPrice: 1000,
            validity: 30
        },
        {
            id: "11",
            enabled: true,
            name: "TelecelBundle",
            agentId: "generic",
            network: "telecel",
            dataPackage: {data: 100},
            agentPrice: 150,
            validity: 30
        },
        {
            id: "12",
            enabled: true,
            name: "TelecelBundle",
            agentId: "generic",
            network: "telecel",
            dataPackage: {data: 100},
            agentPrice: 250,
            validity: 30
        },
    ]
}

// This is the persistent store for agent client session
interface AgentStoreState {
    // Agent Store
    agentStore: AgentStore | null;
    fetchAgentStore: (id: string) => Promise<AgentStore>;
}

export const useAgentStore = create<AgentStoreState>()(
    persist(
        (set, get) => ({
            // Agent Store
            agentStore: null,
            fetchAgentStore: async (storeId) => {
                if (storeId == "wondamart") {
                    set({agentStore: genericStore})
                    return genericStore;
                }
                set({agentStore: null})
                throw new Error("fetchAgentStore is not implemented yet");
            }
        })
    )
);

