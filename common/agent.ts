import type { Timestamp } from "firebase/firestore";
import {type DataBundle} from "./data-bundle.ts"

// The upstream data bundle to be sold
export interface AgentDataBundle extends Omit<DataBundle, "price"> {
    // The agent id or store id of the agent
    agentId: string,

    // The agent price for the upstream bundle.
    // This is what customers of the agent see at the store.
    agentPrice: number
}

export interface AgentDocument {
    // Agent first name
    firstName: string,

    // Agent last name
    lastName: string,

    // Email of the agent
    email: string,

    // Phone number of the agent
    phone: string,

    // StoreData owned by this agent
    store?: AgentStore;
}

export interface AgentStore {
    // A unique identifier for the store this agent controls
    storeId: string,

    // Logo
    logoUrl: string,

    // The full name of the store
    storeName: string,

    // Store phone number
    phoneNumber: string;

    // Email
    email: string;

    // The store opening time of the day
    openingTime: Timestamp,

    // The store closing time of the day
    closingTime: Timestamp,

    // A list of data bundles offered by agent
    dataBundles: AgentDataBundle[];
}
