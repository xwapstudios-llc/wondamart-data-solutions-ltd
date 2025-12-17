import { DataBundle, NetworkId, DataBundleQuery } from "@common/types/data-bundle";
import { collections, db } from "@common/lib/db";
import {
    collection,
    doc,
    getDoc,
    getDocs,
    Query,
    query,
    where,
} from "firebase/firestore";

const createQuery = (q: DataBundleQuery): Query => {
    let Q = query(collection(db, collections.dataBundles));
    if (q.network) {
        Q = query(Q, where("network", "==", q.network));
    }
    if (q.validityPeriod || q.validityPeriod == 0) {
        if (q.validityPeriod == -1) Q = query(Q, where("validityPeriod", "!=", 0));
        else Q = query(Q, where("validityPeriod", "==", q.validityPeriod));
    }
    return Q;
};

const DataBundles = {
    //
    // Create
    //
    // Read
    readOne: async (dID: string): Promise<DataBundle | undefined> => {
        const d = await getDoc(doc(db, collections.dataBundles, dID));
        if (d.exists()) return d.data() as DataBundle;
    },
    readAll: async (): Promise<DataBundle[]> => {
        // Query all data bundles from the collection
        const snapshot = await getDocs(createQuery({}));
        return snapshot.docs.map((doc) => doc.data() as DataBundle);
    },
    readByNetwork: async (network: NetworkId): Promise<DataBundle[]> => {
        const snapshot = await getDocs(createQuery({ network: network }));
        return snapshot.docs.map((doc) => doc.data() as DataBundle);
    },
    read: async (q: DataBundleQuery): Promise<DataBundle[]> => {
        const snapshot = await getDocs(createQuery(q));
        return snapshot.docs.map((doc) => doc.data() as DataBundle);
    },
    // Client cannot update or delete data bundles
};

export { DataBundles };
