import {collections, db} from "@common/lib/db";
import {doc, getDoc, getDocs} from "firebase/firestore";
import { type Tx, type TxQuery } from "@common/tx";
import { buildTxQuery } from "@common/lib/tx-query";

const ClTx = {
    readOne: async (txId: string): Promise<Tx | undefined> => {
        const d = await getDoc(doc(db, collections.tx, txId));
        if (d.exists()) return d.data() as Tx;
    },
    read: async (q: TxQuery): Promise<Tx[]> => {
        const docs = await getDocs(buildTxQuery(q));
        return docs.docs.map((d) => d.data() as Tx);
    }
};

export { ClTx };
