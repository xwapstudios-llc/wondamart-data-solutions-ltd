// Create
//
// Read
//

import {ClTx} from "@common/client-api/tx";
import {Tx, TxQueryAdmin} from "@common/types/tx";
import {doc, getDoc, getDocs} from "firebase/firestore";
import {collections, db} from "@common/lib/db";
import { buildAdminTxQuery } from "@common/lib/tx-query";

const AdminTx = {
    ...ClTx,

    // Read
    readOne: async (uid: string): Promise<Tx | undefined> => {
        const d = await getDoc(doc(db, collections.tx, uid));
        if (d.exists()) return d.data() as Tx;
    },
    read: async (q: TxQueryAdmin): Promise<Tx[]> => {
        const docs = await getDocs(buildAdminTxQuery(q));
        return docs.docs.map((d) => d.data() as Tx)
    }
};

export { AdminTx };