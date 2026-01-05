"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataBundles = void 0;
const db_1 = require("@common/lib/db");
const firestore_1 = require("firebase/firestore");
const createQuery = (q) => {
    let Q = (0, firestore_1.query)((0, firestore_1.collection)(db_1.db, db_1.collections.dataBundles));
    if (q.network) {
        Q = (0, firestore_1.query)(Q, (0, firestore_1.where)("network", "==", q.network));
    }
    if (q.validityPeriod || q.validityPeriod == 0) {
        if (q.validityPeriod == -1)
            Q = (0, firestore_1.query)(Q, (0, firestore_1.where)("validityPeriod", "!=", 0));
        else
            Q = (0, firestore_1.query)(Q, (0, firestore_1.where)("validityPeriod", "==", q.validityPeriod));
    }
    return Q;
};
const DataBundles = {
    //
    // Create
    //
    // Read
    readOne: async (dID) => {
        const d = await (0, firestore_1.getDoc)((0, firestore_1.doc)(db_1.db, db_1.collections.dataBundles, dID));
        if (d.exists())
            return d.data();
    },
    readAll: async () => {
        // Query all data bundles from the collection
        const snapshot = await (0, firestore_1.getDocs)(createQuery({}));
        return snapshot.docs.map((doc) => doc.data());
    },
    readByNetwork: async (network) => {
        const snapshot = await (0, firestore_1.getDocs)(createQuery({ network: network }));
        return snapshot.docs.map((doc) => doc.data());
    },
    read: async (q) => {
        const snapshot = await (0, firestore_1.getDocs)(createQuery(q));
        return snapshot.docs.map((doc) => doc.data());
    },
    // Client cannot update or delete data bundles
};
exports.DataBundles = DataBundles;
//# sourceMappingURL=db-data-bundle.js.map