import {Tx, TxStatus, TxType} from "@common/tx";
import {txCollections} from "../collections";
import {Timestamp} from "firebase-admin/firestore";
import {generateTxID} from "../../utils/uid-gen";
import {TxCommissionFn} from "./tx-commission";
import {UserFn} from "../user-fn";
import {HendyLinksCreateOrderResponse} from "../../providers/hendy-links/api";
import {DatamartPurchaseResult} from "../../providers/data-mart/api";

const TxFn = {
    read(txId: string): Promise<Tx> {
        const ref = txCollections.doc(txId);
        return ref.get().then(doc => {
            if (!doc.exists) throw new Error("Transaction doesn't exist");
            return doc.data() as Tx;
        });
    },
    update_status: async (txId: string, status: TxStatus) => {
        const docRef: FirebaseFirestore.DocumentReference = txCollections.doc(txId);
        const doc = await docRef.get();
        if (!doc.exists) throw new Error("Transaction does not exist");
        if (status === "success" || status === "failed") {
            await docRef.set({ status, timeCompleted: Timestamp.now() }, {merge: true});
        } else {
            await docRef.set({ status }, {merge: true});
        }
    },
    update_status_success: async (txId: string) => {
        await TxFn.update_status(txId, "success");
        const tx = await TxFn.read(txId);
        if (tx.type !== "paystack-deposit" && tx.type !== "manual-deposit") {
            await TxCommissionFn.create(tx.agentId, {
                txID: tx.txId,
                commission: tx.commission ?? 0,
                // @ts-ignore
                date: Timestamp.now(),
            });
        }
    },
    // Keep "completed" alias so existing call-sites compile during migration
    update_status_completed: async (txId: string) => TxFn.update_status_success(txId),
    update_status_pending:    async (txId: string) => TxFn.update_status(txId, "pending"),
    update_status_processing: async (txId: string) => TxFn.update_status(txId, "processing"),
    update_status_failed:     async (txId: string) => TxFn.update_status(txId, "failed"),
    commit: async (tx: Tx) => {
        const ref = txCollections.doc(tx.txId);
        await ref.set(tx);
        if (tx.type !== "paystack-deposit" && tx.type !== "manual-deposit") {
            await UserFn.update_add_recentTransaction(tx.agentId, tx.txId);
        }
    },
    addExtraData: async (txId: string, data: any) => {
        const docRef: FirebaseFirestore.DocumentReference = txCollections.doc(txId);
        const doc = await docRef.get();
        if (!doc.exists) throw new Error("Transaction does not exist");
        await docRef.set({ txData: { ...(doc.data()?.txData ?? {}), ...data } }, {merge: true});
    },
    addHendyLinksData: async (txId: string, data: HendyLinksCreateOrderResponse) => {
        const docRef: FirebaseFirestore.DocumentReference = txCollections.doc(txId);
        const doc = await docRef.get();
        if (!doc.exists) throw new Error("Transaction does not exist");
        await docRef.set({
            txData: { ...(doc.data()?.txData ?? {}), hendyLinks: data },
            hendyLinksTxId: data.order_id.toString(),
        }, {merge: true});
    },
    readHendyLinksData: async (hendyLinksTxId: string) => {
        const q = await txCollections.where("hendyLinksTxId", "==", hendyLinksTxId).get();
        if (q.empty) return undefined;
        return q.docs[0].data() as Tx;
    },
    addDatamartData: async (txId: string, data: DatamartPurchaseResult) => {
        const docRef: FirebaseFirestore.DocumentReference = txCollections.doc(txId);
        const doc = await docRef.get();
        if (!doc.exists) throw new Error("Transaction does not exist");
        await docRef.set({
            txData: { ...(doc.data()?.txData ?? {}), datamart: data },
            datamartTxId: data.purchaseId,
        }, {merge: true});
    },
    readDatamartData: async (datamartTxId: string) => {
        const q = await txCollections.where("datamartTxId", "==", datamartTxId).get();
        if (q.empty) return undefined;
        return q.docs[0].data() as Tx;
    },
    initialDoc: async (type: TxType, agentId: string, balance: number = 0): Promise<Omit<Tx, "type">> => {
        return {
            txId: await generateTxID(type),
            agentId,
            status: "pending",
            amount: 0,
            balance,
            // @ts-expect-error server Timestamp lacks json()
            time: Timestamp.now(),
            txData: {},
        };
    },
};

export {TxFn};
