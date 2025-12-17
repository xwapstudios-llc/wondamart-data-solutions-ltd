// Create
//
// Read
//
import { db } from "@common/lib/db";
import { Functions } from "@common/lib/fn";
import { doc, getDoc, getDocs, query, Query, where } from "firebase/firestore";
import { buildTxQuery } from "@common/lib/tx-query";
import { type TxAfaBundle, type TxAfaBundleQuery, type TxAfaBundleRequest } from "@common/types/afa-bundle";

const createQuery = (q: TxAfaBundleQuery): Query => {
    let Q = buildTxQuery(q);
    if (q.phoneNumber) Q = query(Q, where("data.phoneNumber", "==", q.phoneNumber));
        if (q.idNumber) Q = query(Q, where("data.idNumber", "==", q.idNumber));
        if (q.date_of_birth) Q = query(Q, where("data.date_of_birth", "==", q.date_of_birth));
    return Q;
}

const ClTxAFABundle = {
    //
    // Create
    create: async (data: TxAfaBundleRequest): Promise<void> => {
        try {
            await Functions.Request.AFABundle(data);
            return Promise.resolve();
        } catch (error) {
            console.error("Error calling function:", error);
            // const code = error.code;
            // @ts-expect-error : message might not exist on error obj
            const message = error.message;
            return Promise.reject(
                new Error(message || "Failed to request AFA Bundle")
            );
        }
    },
    //
    // Read
    readOne: async (uid: string): Promise<TxAfaBundle | undefined> => {
        const d = await getDoc(doc(db, uid));
        if (d.exists()) return d.data() as TxAfaBundle;
    },
    async read(q: TxAfaBundleQuery): Promise<TxAfaBundle[]> {
        const docs = await getDocs(createQuery(q));
        return docs.docs.map((d) => d.data() as TxAfaBundle)
    }
};

export { ClTxAFABundle };
