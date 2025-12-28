// Create
//
// Read
//
import { collections, db } from "@common/lib/db";
import { Functions } from "@common/lib/fn";
import { doc, getDoc, getDocs, Query, query, where } from "firebase/firestore";
import { buildTxQuery } from "@common/lib/tx-query";
import { type TxResultChecker, type TxResultCheckerQuery, type TxResultCheckerRequest } from "@common/types/result-checker";
import {HTTPResponse} from "@common/types/request";

const createQuery = (q: TxResultCheckerQuery): Query => {
    let Q = buildTxQuery(q);
    if (q.checkerType) Q = query(Q, where("data.checkerType", "==", q.checkerType));
    if (q.units) Q = query(Q, where("data.units", "==", q.units));
    return Q;
}

const ClTxResultChecker = {
    //
    // Create
    create: async (data: TxResultCheckerRequest): Promise<HTTPResponse> => {
        const result = await Functions.Request.ResultChecker(data);
        return Promise.resolve(result.data as HTTPResponse);
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
