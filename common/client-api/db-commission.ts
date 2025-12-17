import {doc, getDoc, getDocs} from "firebase/firestore";
import {db} from "@common/lib/db";
import {collections} from "@common/lib/collections";
import {buildCommissionQuery, CommissionDoc, CommissionQuery} from "@common/types/commissions";

const ClCommission = {
    //
    // Read
    readOne: async (id: string): Promise<CommissionDoc | undefined> => {
        const d = await getDoc(doc(db, collections.commissions, id));
        if (d.exists()) return d.data() as CommissionDoc;
    },
    read: async (q: CommissionQuery): Promise<CommissionDoc[]> => {
        const docs = await getDocs(buildCommissionQuery(q));
        return docs.docs.map((d) => d.data() as CommissionDoc);
    },
    readAll: async (id: string): Promise<CommissionDoc[]> => {
        const docs = await getDocs(buildCommissionQuery({uid: id}));
        return docs.docs.map((d) => d.data() as CommissionDoc)
    }
}

export {
    ClCommission
}