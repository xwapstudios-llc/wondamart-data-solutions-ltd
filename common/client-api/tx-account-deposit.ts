import type {
    TxDeposit, TxDepositMoMoRequest,
    TxAccountDepositQuery,
    TxDepositPaystackRequest,
    TxDepositSendRequest, TxSubmitOTPRequest
} from "@common/types/account-deposit";
import { collections, db } from "@common/lib/db";
import { doc, getDoc, getDocs, Query, query, where } from "firebase/firestore";
import { buildTxQuery } from "@common/lib/tx-query";
import type {HTTPResponse} from "@common/types/request";
import {pay_wondamart_req} from "@common/lib/pay-wondamart";

const createQuery = (q: TxAccountDepositQuery): Query => {
    let Q = buildTxQuery(q);
    if (q.network) Q = query(Q, where("data.network", "==", q.network));
    if (q.phoneNumber) Q = query(Q, where("data.phoneNumber", "==", q.phoneNumber));
    return Q;
}

const ClTxAccountDeposit = {
    otp: {
        submit: async (data: TxSubmitOTPRequest): Promise<HTTPResponse> => {
            return await pay_wondamart_req(
                "/deposit/paystack/submit-otp",
                data
            );
        },
        // resend: async (txID: string): Promise<HTTPResponse> => {
        //     return await pay_wondamart_req(
        //             "/deposit/paystack/resend-otp",
        //             txID
        //         );
        // },
    },
    create: {
        paystack: async (data: TxDepositPaystackRequest): Promise<HTTPResponse> => {
            return await pay_wondamart_req(
                "/deposit/paystack",
                data
            );
        },
        send: async (data: TxDepositSendRequest): Promise<HTTPResponse> => {
            return await pay_wondamart_req(
                "/deposit/send",
                data
            );
        },
        momo: async (data: TxDepositMoMoRequest): Promise<HTTPResponse> => {
            return await pay_wondamart_req(
                "/deposit/momo",
                data
            );
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
