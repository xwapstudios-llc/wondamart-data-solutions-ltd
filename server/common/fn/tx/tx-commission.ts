import {CommissionDoc, CommissionObj} from "@common/types/commissions";
import {commissionsCollections} from "../collections";
import {Timestamp} from "firebase-admin/firestore";

const TxCommissionFn = {
    getDocIDFor: (year: number, monthIndex: number, uid: string) => {
        const m = monthIndex.toString().padStart(2, "0");
        return `${year}-${m}-${uid}`;
    },

    getDocID: (uid: string) => {
        const date = Timestamp.now();
        const year = date.toDate().getFullYear();
        const monthIndex = date.toDate().getMonth();
        return TxCommissionFn.getDocIDFor(year, monthIndex, uid);
    },

    create: async (uid: string, data: CommissionObj) => {
        const docID = TxCommissionFn.getDocID(uid);
        const docRef = commissionsCollections.doc(docID);

        const doc = await docRef.get();
        if (!doc.exists) {
            await docRef.set({
                ...TxCommissionFn.initDoc(uid),
                commissions: [data],
                updatedAt: Timestamp.now(),
            } as CommissionDoc);
        } else {
            const previousCommissions = doc.data() as CommissionDoc;
            await docRef.update({
                commissions: previousCommissions.commissions?.concat(data),
                updatedAt: Timestamp.now(),
            })
        }
    },
    initDoc: (uid: string): CommissionDoc => {
        const date = Timestamp.now();
        const year = date.toDate().getFullYear();
        const monthIndex = date.toDate().getMonth();

        // Get the first moment of next month
        const startOfNextMonth = Timestamp.fromDate(new Date(year, monthIndex + 1));

        const endOfMonth = startOfNextMonth.toMillis() - 1;

        return {
            uid: uid,
            id: TxCommissionFn.getDocIDFor(year, monthIndex, uid),
            year: year,
            monthIndex: monthIndex,
            commissions: [],
            payed: false,
            // @ts-ignore
            endOfMonth: Timestamp.fromMillis(endOfMonth),
        }
    }
}

export {
    TxCommissionFn
}