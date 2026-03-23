import {collections, db} from "@common/lib/db";
import { type TxQuery, type TxQueryAdmin } from "@common/tx";
import { collection, Query, query, Timestamp, where, limit, startAfter, orderBy } from "firebase/firestore";

const startOfDay = (d: Date | Timestamp): Timestamp => {
    const date = d instanceof Timestamp ? d.toDate() : d;
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    return Timestamp.fromDate(start);
};

const endOfDay = (d: Date | Timestamp): Timestamp => {
    const date = d instanceof Timestamp ? d.toDate() : d;
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);
    return Timestamp.fromDate(end);
};

export const buildTxQuery = (q: TxQuery): Query => {
    let Q = buildAdminTxQuery(q);
    Q = query(Q, where("agentId", "==", q.agentId));
    return Q;
};

export const buildAdminTxQuery = (q: TxQueryAdmin): Query => {
    let Q = query(collection(db, collections.tx));

    if (q.agentId) Q = query(Q, where("agentId", "==", q.agentId));
    if (q.type)    Q = query(Q, where("type", "==", q.type));
    if (q.status)  Q = query(Q, where("status", "==", q.status));

    Q = query(Q, orderBy("time", "desc"));

    if (q.startAfter) Q = query(Q, startAfter(q.startAfter));
    if (q.limit)      Q = query(Q, limit(q.limit));

    if (q.amount) {
        if (q.amountCompare) Q = query(Q, where("amount", q.amountCompare, q.amount));
        else Q = query(Q, where("amount", "==", q.amount));
    }

    if (q.commission) {
        if (q.commissionCompare) Q = query(Q, where("commission", q.commissionCompare, q.commission));
        else Q = query(Q, where("commission", "==", q.commission));
    }

    if (q.time) {
        if (q.time instanceof Date || q.time instanceof Timestamp) {
            Q = query(Q, where("time", ">=", startOfDay(q.time)));
            Q = query(Q, where("time", "<=", endOfDay(q.time)));
        } else {
            Q = query(Q, where("time", ">=", startOfDay(q.time.from)));
            Q = query(Q, where("time", "<=", endOfDay(q.time.to)));
        }
    }

    return Q;
};
