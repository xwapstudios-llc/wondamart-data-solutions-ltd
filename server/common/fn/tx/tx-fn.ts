// Create
// Read
// Update
// Delete
// List
// Search


import {Tx, TxStatus, TxType} from "@common/types/tx";
import {txCollections} from "../collections";
import {Timestamp} from "firebase-admin/firestore";
import {generateTxID} from "../../utils/uid-gen";
import {TxCommissionFn} from "./tx-commission";
import {UserFn} from "../user-fn";

const TxFn = {
    read(txID: string): Promise<Tx> {
        const ref = txCollections.doc(txID);
        return ref.get().then(doc => {
            if (!doc.exists) {
                throw new Error("Transaction doesn't exist");
            }
            return doc.data() as Tx;
        });
    },
    update_status: async (txID: string, status: TxStatus) => {
        let docRef: FirebaseFirestore.DocumentReference = txCollections.doc(txID);
        const doc = await docRef.get();
        if (!doc.exists) throw new Error("Transaction does not exist");
        if (status == "completed" || status == "failed") {
            await docRef.set({
                status: status,
                updatedAt: Timestamp.now(),
                finishedAt: Timestamp.now(),
            }, {merge: true});
        } else {
            await docRef.set({
                status: status,
                updatedAt: Timestamp.now(),
            }, {merge: true});
        }
    },
    update_status_completed: async (txID: string) => {
        await TxFn.update_status(txID, "completed");
        // Read Tx
        const tx = await TxFn.read(txID);
        if (tx.type != "deposit") {
            await TxCommissionFn.create(tx.uid, {
                txID: tx.id,
                commission: tx.commission,
                // @ts-ignore
                date: Timestamp.now(),
            });
        }
    },
    update_status_pending: async (txID: string) => {
        await TxFn.update_status(txID, "pending");
    },
    update_status_processing: async (txID: string) => {
        await TxFn.update_status(txID, "processing");
    },
    update_status_failed: async (txID: string) => {
        await TxFn.update_status(txID, "failed");
    },
    commit: async (tx: Tx) => {
        const ref = txCollections.doc(tx.id);
        await ref.set(tx);
        if (tx.type != "deposit") {
            await UserFn.update_add_recentTransaction(tx.uid, tx.id);
        }
    },
    addExtraData: async (txID: string, data: any) => {
        let docRef: FirebaseFirestore.DocumentReference = txCollections.doc(txID);
        const doc = await docRef.get();
        if (!doc.exists) throw new Error("Transaction does not exist");
        await docRef.set({
            updatedAt: Timestamp.now(),
            extraData: data,
        }, {merge: true});
    },
    // Create an initial transaction document object
    // This does not create the document in Firestore, just returns the object
    initialDoc: async (type: TxType, uid: string): Promise<Omit<Tx, "type">> => {
        return {
            id: await generateTxID(type),
            uid: uid,
            status: "pending",
            amount: 0,
            commission: 0,
            // @ts-expect-error, server do not have the json function in the Timestamp class
            date: Timestamp.now(),
            // @ts-expect-error, server do not have the json function in the Timestamp class
            updatedAt: Timestamp.now(),
        }
    }
}

export {TxFn};