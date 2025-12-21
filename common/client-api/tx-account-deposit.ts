// Create
//
// Read
//

// Create
//
// Read
//
import type {
    TxDeposit, TxDepositMoMoRequest,
    TxAccountDepositQuery,
    TxDepositPaystackRequest,
    TxDepositSendRequest
} from "@common/types/account-deposit";
import { collections, db } from "@common/lib/db";
import { Functions } from "@common/lib/fn";
import { doc, getDoc, getDocs, Query, query, where } from "firebase/firestore";
import { buildTxQuery } from "@common/lib/tx-query";
import {HTTPResponse} from "@common/types/request";

const createQuery = (q: TxAccountDepositQuery): Query => {
    let Q = buildTxQuery(q);
    if (q.network) Q = query(Q, where("data.network", "==", q.network));
    if (q.phoneNumber) Q = query(Q, where("data.phoneNumber", "==", q.phoneNumber));
    return Q;
}


const ClTxAccountDeposit = {
    create: {
        paystack: async (data: TxDepositPaystackRequest): Promise<HTTPResponse> => {
            const result = await Functions.Request.deposit.paystack(data) as HTTPResponse;
            return Promise.resolve(result);
        },
        send: async (data: TxDepositSendRequest): Promise<void> => {
            try {
                await Functions.Request.deposit.send(data);
                return Promise.resolve();
            } catch (error) {
                console.error("Error calling function:", error);
                // const code = error.code;
                // @ts-expect-error : message might not exist on error object
                const message = error.message;
                return Promise.reject(
                    new Error(message || "Failed to create account deposit")
                );
            }
        },
        momo: async (data: TxDepositMoMoRequest): Promise<void> => {
            try {
                await Functions.Request.deposit.momo(data);
                return Promise.resolve();
            } catch (error) {
                console.error("Error calling function:", error);
                // const code = error.code;
                // @ts-expect-error : message might not exist on error object
                const message = error.message;
                return Promise.reject(
                    new Error(message || "Failed to create account deposit")
                );
            }
        },
    },
    readOne: async (uid: string): Promise<TxDeposit | undefined> => {
        // Can read from db since uid is known from auth context
        const d = await getDoc(doc(db, collections.tx, uid));
        if (d.exists()) return d.data() as TxDeposit;
    },
    read: async (q: TxAccountDepositQuery): Promise<TxDeposit[]> => {
        const docs = await getDocs(createQuery(q));
        return docs.docs.map((d) => d.data() as TxDeposit)
    }
    // Client cannot update or delete account deposits
};

export { ClTxAccountDeposit };
