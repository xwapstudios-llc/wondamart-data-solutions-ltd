import { TxDataBundle, TxDataBundleQuery, TxDataBundleRequest } from "@common/types/data-bundle";
import { collections, db } from "@common/lib/db";
import { Functions } from "@common/lib/fn";
import { doc, getDoc, getDocs, Query, query, where } from "firebase/firestore";
import { buildTxQuery } from "@common/lib/tx-query";

const createQuery = (q: TxDataBundleQuery): Query => {
    let Q = buildTxQuery(q);
    if (q.network) Q = query(Q, where("data.network", "==", q.network));
    if (q.bundleId) Q = query(Q, where("data.bundleId", "==", q.bundleId));
    if (q.phoneNumber) Q = query(Q, where("data.phoneNumber", "==", q.phoneNumber));
    return Q;
}

const ClTxDataBundle = {
    //
    // Create
    create: async (data: TxDataBundleRequest): Promise<void> => {
        try {
            await Functions.Request.DataBundle(data);
            return Promise.resolve();
        } catch (error) {
            console.error("Error calling function:", error);
            // const code = error.code;
            // @ts-expect-error : message might not exist on error obj
            const message = error.message;
            return Promise.reject(
                new Error(message || "Failed to request data bundle")
            );
        }
    },
    //
    // Read
    readOne: async (uid: string): Promise<TxDataBundle | undefined> => {
        const d = await getDoc(doc(db, collections.tx, uid));
        if (d.exists()) return d.data() as TxDataBundle;
    },
    read: async (q: TxDataBundleQuery): Promise<TxDataBundle[]> => {
        const docs = await getDocs(createQuery(q));
        return docs.docs.map((d) => d.data() as TxDataBundle)
    }
};

export { ClTxDataBundle };
