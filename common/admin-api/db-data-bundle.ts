// Create
//
// Read
//
// Update
//
// Delete

import { DataBundles } from "@common/client-api/db-data-bundle";
import { collections, db } from "@common/lib/db";
import { Functions } from "@common/lib/fn";
import {
    type AdminNewDataBundle,
    DataBundle, DataBundleQuery,
    type DataPackage,
    type ValidityPeriod
} from "@common/types/data-bundle";
import {collection, getDocs, query, Query, Timestamp, where} from "firebase/firestore";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import {gen_bundle_id} from "@common/gen_id";

const createQuery = (q: DataBundleQuery, coll?: string): Query => {
    let Q = query(collection(db, coll ? coll : collections.dataBundles));
    if (q.network) {
        Q = query(Q, where("network", "==", q.network));
    }
    if (q.validityPeriod) {
        Q = query(Q, where("validityPeriod", "==", q.validityPeriod));
    }
    return Q;
};

const AdminDataBundles = {
    create: async (data: AdminNewDataBundle): Promise<void> => {
        try {
            const id = gen_bundle_id(data);
            const ref = doc(
                db,
                collections.dataBundles,
                id
            );
            const d = await getDoc(ref);
            if (!d.exists()) {
                await Functions.DataBundle.create(data);
            }
            return Promise.resolve();
        } catch(err) {
            // const code = error.code;
            // @ts-expect-error : message might not exist on error obj
            const message = error.message;
            return Promise.reject(message || "An Error occurred while creating data bundle");
        }
    },
    updateEnabled: async (bID: string, enabled: boolean) => {
        const ref = doc(db, collections.dataBundles, bID);
        const d = await getDoc(ref);
        if (d.exists()) {
            await updateDoc(ref, {
                updatedAt: Timestamp.now(),
                enabled: enabled,
            });
        }
    },
    updatePrice: async (bID: string, price: number) => {
        const ref = doc(db, collections.dataBundles, bID);
        const d = await getDoc(ref);
        if (d.exists()) {
            await updateDoc(ref, {
                updatedAt: Timestamp.now(),
                price: price,
            });
        }
    },
    updateCommission: async (bID: string, commission: number) => {
        const ref = doc(db, collections.dataBundles, bID);
        const d = await getDoc(ref);
        if (d.exists()) {
            await updateDoc(ref, {
                updatedAt: Timestamp.now(),
                commission: commission,
            });
        }
    },
    updateValidityPeriod: async (
        bID: string,
        validityPeriod: ValidityPeriod
    ) => {
        const ref = doc(db, collections.dataBundles, bID);
        const d = await getDoc(ref);
        if (d.exists()) {
            await updateDoc(ref, {
                updatedAt: Timestamp.now(),
                validityPeriod: validityPeriod,
            });
        }
    },
    updateDataSize: async (bID: string, dataPackage: DataPackage) => {
        const ref = doc(db, collections.dataBundles, bID);
        const d = await getDoc(ref);
        if (d.exists()) {
            await updateDoc(ref, {
                updatedAt: Timestamp.now(),
                dataPackage: dataPackage,
            });
        }
    },
    updateName: async (bID: string, name: string) => {
        const ref = doc(db, collections.dataBundles, bID);
        const d = await getDoc(ref);
        if (d.exists()) {
            await updateDoc(ref, {
                updatedAt: Timestamp.now(),
                name: (name.length > 0 && name.trim() != "" && name) ? name : "",
            });
        }
    },
    delete: async (bID: string): Promise<void> => {
        try {
            const ref = doc(db, collections.dataBundles, bID);
            const d = await getDoc(ref);
            if (d.exists()) {
                await Functions.DataBundle.delete(bID);
            }
            return Promise.resolve();
        } catch(err) {
            // const code = error.code;
            // @ts-expect-error : message might not exist on error obj
            const message = error.message;
            return Promise.reject(message || "An Error occurred while deleting data bundle");
        }
    },
    readAllDeleted: async (): Promise<DataBundle[]> => {
        // Query all data bundles from the collection
        const snapshot = await getDocs(createQuery({}, collections.deletedDataBundles));
        return snapshot.docs.map((doc) => doc.data() as DataBundle);
    },
    ...DataBundles,
};

export { AdminDataBundles };
