import { type TxDataBundle, type TxDataBundleQuery, type TxDataBundleRequest } from "@common/types/data-bundle";
import { collections, db } from "@common/lib/db";
import { doc, getDoc, getDocs, Query, query, where } from "firebase/firestore";
import { buildTxQuery } from "@common/lib/tx-query";
import type {HTTPResponse} from "@common/types/request";
import {wondamart_api_client} from "@common/lib/api-wondamart";

const createQuery = (q: TxDataBundleQuery): Query => {
    let Q = buildTxQuery(q);
    Q = query(Q, where("type", "==", "data-bundle"));
    if (q.network) Q = query(Q, where("data.network", "==", q.network));
    if (q.bundleId) Q = query(Q, where("data.bundleId", "==", q.bundleId));
    if (q.phoneNumber) Q = query(Q, where("data.phoneNumber", "==", q.phoneNumber));
    return Q;
}

const ClTxDataBundle = {
    //
    // Create
    create: async (data: TxDataBundleRequest): Promise<HTTPResponse> => {
        return await wondamart_api_client(
            "/buy/data-bundle",
            data
        );
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
