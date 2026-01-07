import { collections, db } from "@common/lib/db";
import { doc, getDoc, getDocs, Query, query, where } from "firebase/firestore";
import { buildTxQuery } from "@common/lib/tx-query";
import { type TxResultChecker, type TxResultCheckerQuery, type TxResultCheckerRequest } from "@common/types/result-checker";
import type {HTTPResponse} from "@common/types/request";
import {wondamart_api_client} from "@common/lib/api-wondamart";

const createQuery = (q: TxResultCheckerQuery): Query => {
    let Q = buildTxQuery(q);
    Q = query(Q, where("type", "==", "result-checker"));
    if (q.checkerType) Q = query(Q, where("data.checkerType", "==", q.checkerType));
    if (q.units) Q = query(Q, where("data.units", "==", q.units));
    return Q;
}

const ClTxResultChecker = {
    //
    // Create
    create: async (data: TxResultCheckerRequest): Promise<HTTPResponse> => {
        return await wondamart_api_client(
            "/buy/result-checker",
            data
        );
    },
    //
    // Read
    readOne: async (uid: string): Promise<TxResultChecker | undefined> => {
        const d = await getDoc(doc(db, collections.tx, uid));
        if (d.exists()) return d.data() as TxResultChecker;
    },
    async read(q: TxResultCheckerQuery): Promise<TxResultChecker[]> {
        const docs = await getDocs(createQuery(q));
        return docs.docs.map((d) => d.data() as TxResultChecker)
    }
};

export { ClTxResultChecker };
