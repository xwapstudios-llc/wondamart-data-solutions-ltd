import {collection, limit, query, Query, startAfter, Timestamp, where, WhereFilterOp} from "firebase/firestore";
import {db} from "@common/lib/db";
import {collections} from "@common/lib/collections";

export interface CommissionDoc {
    uid: string;
    id: string;  // Generate different ID for each transaction
    year: number;
    monthIndex: number;
    commissions?: CommissionObj[];
    payed: boolean;
    endOfMonth: Timestamp; // timestamp in millis
    updatedAt: Timestamp;
}

export interface CommissionObj {
    txID: string;
    commission: number;
    date: Timestamp;
}

export interface CommissionQuery {
    id?: string;
    uid: string;

    year?: number;
    yearCompare?: WhereFilterOp;

    monthIndex?: number;
    monthIndexCompare?: WhereFilterOp;

    payed?: boolean;
    monthEnded?: boolean;

    startAfter?: number;
    limit?: number;
}

export interface CommissionQueryAdmin extends Omit<CommissionQuery, "uid"> {
    uid?: string;
}

export const buildCommissionQuery = (q: CommissionQuery) => {
    return query(buildAdminCommissionQuery(q), where("uid", "==", q.uid));
}

export const buildAdminCommissionQuery = (q: CommissionQueryAdmin): Query => {
    let Q = query(collection(db, collections.commissions));

    if (q.limit) Q = query(Q, limit(q.limit));
    if (q.startAfter) Q = query(Q, startAfter(q.startAfter));

    if (q.id) Q = query(Q, where("id", "==", q.id));
    if (q.uid) Q = query(Q, where("uid", "==", q.uid));

    if (q.year) {
        if (q.yearCompare) Q = query(Q, where("year", q.yearCompare, q.year));
        else Q = query(Q, where("year", "==", q.year));
    }

    if (q.monthIndex) {
        if (q.monthIndexCompare) Q = query(Q, where("monthIndex", q.monthIndexCompare, q.monthIndex));
        else Q = query(Q, where("monthIndex", "==", q.monthIndex));
    }

    if (q.monthEnded) Q = query(Q, where("endOfMonth", "<", Timestamp.now()))

    return Q;
};
