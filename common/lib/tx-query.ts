import {collections, db} from "@common/lib/db";
import { type TxQuery, type TxQueryAdmin } from "@common/types/tx";
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
    Q = query(Q, where("uid", "==", q.uid));
    return Q;
};
export const buildAdminTxQuery = (q: TxQueryAdmin): Query => {
    let Q = query(collection(db, collections.tx));

    if (q.uid) Q = query(Q, where("uid", "==", q.uid));
    if (q.type) Q = query(Q, where("type", "==", q.type));
    if (q.status) Q = query(Q, where("status", "==", q.status));
    
    // Add orderBy for pagination
    Q = query(Q, orderBy("date", "desc"));
    
    if (q.startAfter) Q = query(Q, startAfter(q.startAfter));
    if (q.limit) Q = query(Q, limit(q.limit));

    if (q.amount) {
        if (q.amountCompare) Q = query(Q, where("amount", q.amountCompare, q.amount));
        else Q = query(Q, where("amount", "==", q.amount));
    }

    if (q.commission) {
        if (q.commissionCompare) Q = query(Q, where("commission", q.commissionCompare, q.commission));
        else Q = query(Q, where("commission", "==", q.commission));
    }

    if (q.date) {
        if (q.date instanceof Date || q.date instanceof Timestamp) {
            // Single day → expand to [00:00:00, 23:59:59]
            Q = query(Q, where("date", ">=", startOfDay(q.date)));
            Q = query(Q, where("date", "<=", endOfDay(q.date)));
        } else {
            // Range → just cast
            Q = query(Q, where("date", ">=", startOfDay(q.date.from)));
            Q = query(Q, where("date", "<=", endOfDay(q.date.to)));
        }
    }

    return Q;
};
