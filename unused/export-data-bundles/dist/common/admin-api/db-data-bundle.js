"use strict";
// Create
//
// Read
//
// Update
//
// Delete
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminDataBundles = void 0;
const db_data_bundle_1 = require("@common/client-api/db-data-bundle");
const db_1 = require("@common/lib/db");
const fn_1 = require("@common/lib/fn");
const firestore_1 = require("firebase/firestore");
const firestore_2 = require("firebase/firestore");
const gen_id_1 = require("@common/gen_id");
const createQuery = (q, coll) => {
    let Q = (0, firestore_1.query)((0, firestore_1.collection)(db_1.db, coll ? coll : db_1.collections.dataBundles));
    if (q.network) {
        Q = (0, firestore_1.query)(Q, (0, firestore_1.where)("network", "==", q.network));
    }
    if (q.validityPeriod) {
        Q = (0, firestore_1.query)(Q, (0, firestore_1.where)("validityPeriod", "==", q.validityPeriod));
    }
    return Q;
};
const AdminDataBundles = {
    create: async (data) => {
        try {
            const id = (0, gen_id_1.gen_bundle_id)(data);
            const ref = (0, firestore_2.doc)(db_1.db, db_1.collections.dataBundles, id);
            const d = await (0, firestore_2.getDoc)(ref);
            if (!d.exists()) {
                await fn_1.Functions.DataBundle.create(data);
            }
            return Promise.resolve();
        }
        catch (err) {
            // const code = error.code;
            // @ts-expect-error : message might not exist on error obj
            const message = error.message;
            return Promise.reject(message || "An Error occurred while creating data bundle");
        }
    },
    updateEnabled: async (bID, enabled) => {
        const ref = (0, firestore_2.doc)(db_1.db, db_1.collections.dataBundles, bID);
        const d = await (0, firestore_2.getDoc)(ref);
        if (d.exists()) {
            await (0, firestore_2.updateDoc)(ref, {
                updatedAt: firestore_1.Timestamp.now(),
                enabled: enabled,
            });
        }
    },
    updatePrice: async (bID, price) => {
        const ref = (0, firestore_2.doc)(db_1.db, db_1.collections.dataBundles, bID);
        const d = await (0, firestore_2.getDoc)(ref);
        if (d.exists()) {
            await (0, firestore_2.updateDoc)(ref, {
                updatedAt: firestore_1.Timestamp.now(),
                price: price,
            });
        }
    },
    updateCommission: async (bID, commission) => {
        const ref = (0, firestore_2.doc)(db_1.db, db_1.collections.dataBundles, bID);
        const d = await (0, firestore_2.getDoc)(ref);
        if (d.exists()) {
            await (0, firestore_2.updateDoc)(ref, {
                updatedAt: firestore_1.Timestamp.now(),
                commission: commission,
            });
        }
    },
    updateValidityPeriod: async (bID, validityPeriod) => {
        const ref = (0, firestore_2.doc)(db_1.db, db_1.collections.dataBundles, bID);
        const d = await (0, firestore_2.getDoc)(ref);
        if (d.exists()) {
            await (0, firestore_2.updateDoc)(ref, {
                updatedAt: firestore_1.Timestamp.now(),
                validityPeriod: validityPeriod,
            });
        }
    },
    updateDataSize: async (bID, dataPackage) => {
        const ref = (0, firestore_2.doc)(db_1.db, db_1.collections.dataBundles, bID);
        const d = await (0, firestore_2.getDoc)(ref);
        if (d.exists()) {
            await (0, firestore_2.updateDoc)(ref, {
                updatedAt: firestore_1.Timestamp.now(),
                dataPackage: dataPackage,
            });
        }
    },
    updateName: async (bID, name) => {
        const ref = (0, firestore_2.doc)(db_1.db, db_1.collections.dataBundles, bID);
        const d = await (0, firestore_2.getDoc)(ref);
        if (d.exists()) {
            await (0, firestore_2.updateDoc)(ref, {
                updatedAt: firestore_1.Timestamp.now(),
                name: (name.length > 0 && name.trim() != "" && name) ? name : "",
            });
        }
    },
    delete: async (bID) => {
        try {
            const ref = (0, firestore_2.doc)(db_1.db, db_1.collections.dataBundles, bID);
            const d = await (0, firestore_2.getDoc)(ref);
            if (d.exists()) {
                await fn_1.Functions.DataBundle.delete(bID);
            }
            return Promise.resolve();
        }
        catch (err) {
            // const code = error.code;
            // @ts-expect-error : message might not exist on error obj
            const message = error.message;
            return Promise.reject(message || "An Error occurred while deleting data bundle");
        }
    },
    readAllDeleted: async () => {
        // Query all data bundles from the collection
        const snapshot = await (0, firestore_1.getDocs)(createQuery({}, db_1.collections.deletedDataBundles));
        return snapshot.docs.map((doc) => doc.data());
    },
    ...db_data_bundle_1.DataBundles,
};
exports.AdminDataBundles = AdminDataBundles;
//# sourceMappingURL=db-data-bundle.js.map