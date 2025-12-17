// Create
//
// Read
//
import {collections, db} from "@common/lib/db";
import {doc, getDoc, getDocs} from "firebase/firestore";
import {Tx, TxQuery} from "@common/types/tx";
import { buildTxQuery } from "@common/lib/tx-query";

const ClTx = {
    //
    // Read
    readOne: async (uid: string): Promise<Tx | undefined> => {
        const d = await getDoc(doc(db, collections.tx, uid));
        if (d.exists()) return d.data() as Tx;
    },
    read: async (q: TxQuery): Promise<Tx[]> => {
        const docs = await getDocs(buildTxQuery(q));
        return docs.docs.map((d) => d.data() as Tx)
    }
};

export { ClTx };
