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
import axios from "axios";
import {api_key} from "../../server/common/utils/api_key";

const createQuery = (q: TxAccountDepositQuery): Query => {
    let Q = buildTxQuery(q);
    if (q.network) Q = query(Q, where("data.network", "==", q.network));
    if (q.phoneNumber) Q = query(Q, where("data.phoneNumber", "==", q.phoneNumber));
    return Q;
}

async function pay_client() {
    return axios.create({
        baseURL: "https://pay.wondamartgh.com",
        timeout: 15000,
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "authorization": `Bearer ${api_key}`
        },
    });
}


const ClTxAccountDeposit = {
    otp: {
        submit: async (data: TxSubmitOTPRequest): Promise<HTTPResponse> => {
            const client = await pay_client();
            const response = await client.post(
                "/deposit/paystack/submit-otp",
                data
            );
            return Promise.resolve(response.data as HTTPResponse);
        },
        // resend: async (txID: string): Promise<HTTPResponse> => {
        //     const client = await pay_client();
        //     const response = await client.post(
        //         "/deposit/paystack/resend-otp",
        //         txID
        //     );
        //     return Promise.resolve(response.data as HTTPResponse);
        // },
    },
    create: {
        paystack: async (data: TxDepositPaystackRequest): Promise<HTTPResponse> => {
            const client = await pay_client();
            console.log("Creating client... headers: > ", client.head("/deposit/paystack"));

            const response = await client.post(
                "/deposit/paystack",
                data
            );

            console.log("Paystack response: data > ", response.data);
            return Promise.resolve(response.data as HTTPResponse);
        },
        send: async (data: TxDepositSendRequest): Promise<HTTPResponse> => {
            const client = await pay_client();
            const response = await client.post(
                "/deposit/send",
                data
            );
            return Promise.resolve(response.data as HTTPResponse);
        },
        momo: async (data: TxDepositMoMoRequest): Promise<HTTPResponse> => {
            const client = await pay_client();
            const response = await client.post(
                "/deposit/momo",
                data
            );
            return Promise.resolve(response.data as HTTPResponse);
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
