
// Actual file
import { getFirestore } from "firebase-admin/firestore";
const db = getFirestore();


export const collections = {
    users: "users",
    wallets: "wallets",

    // Transactions for all cases (like deposits, withdrawals, payments, etc.)
    tx: "transactions",

    commissions: "commissions",

    // This is available to all users and admins for basic infos
    commonSettings: "common-settings",

    // Admin only collections
    admin: "admin",

    // Monitoring
    heartbeats: "server-heartbeats",

    // Servers
    servers: "servers",

    dataBundles: "data-bundles",
    deletedDataBundles: "deleted-data-bundles",
    deletedUsers: "deleted-users",
}

export const heartbeatsCollections = db.collection(collections.heartbeats);
export const serversCollections = db.collection(collections.servers);

export const userCollections = db.collection(collections.users);
export const walletsCollections = db.collection(collections.wallets);
export const txCollections = db.collection(collections.tx);

export const commissionsCollections = db.collection(collections.commissions);
export const commonSettingsCollections = db.collection(collections.commonSettings);

export const dataBundleCollections = db.collection(collections.dataBundles);
export const deletedDataBundleCollections = db.collection(collections.deletedDataBundles);
export const adminCollections = db.collection(collections.admin);

