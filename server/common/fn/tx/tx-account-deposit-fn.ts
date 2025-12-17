// Create
// Update
// Read
// Delete
// List
// Search

import {
    TxDeposit,
    TxDepositMoMoRequest,
    TxDepositPaystackRequest,
    TxDepositSendRequest
} from "@common/types/account-deposit";
import {TxFn} from "./tx-fn";
import {txType} from "@common/types/tx";

const TxAccountDepositFn = {
    create: {
        async paystack(data: TxDepositPaystackRequest) {
            const txDetails: TxDeposit = {
                ...await TxFn.initialDoc(txType.deposit, data.uid),
                type: "deposit",
                amount: data.amount,
                data: {
                    type: "paystack",
                    phoneNumber: data.phoneNumber,
                    email: data.email,
                    network: data.network,
                }
            };
            return txDetails;
        },
        async send(data: TxDepositSendRequest) {
            const txDetails: TxDeposit = {
                ...await TxFn.initialDoc(txType.deposit, data.uid),
                type: "deposit",
                amount: 0, // Todo: read the amount from the messages and update
                data: {
                    type: "send",
                    transactionID: data.transactionID,
                }
            };
            return txDetails;
        },
        async momo(data: TxDepositMoMoRequest) {
            const txDetails: TxDeposit = {
                ...await TxFn.initialDoc(txType.deposit, data.uid),
                type: "deposit",
                amount: data.amount,
                data: {
                    type: "momo",
                    phoneNumber: data.phoneNumber,
                }
            };
            return txDetails;
        }
    },
    async read_TxAccountDepositDoc(txID: string): Promise<TxDeposit> {
        return await TxFn.read(txID) as TxDeposit;
    },
    createAndCommit: {
        async paystack(data: TxDepositPaystackRequest): Promise<TxDeposit> {
            const details = await TxAccountDepositFn.create.paystack(data);
            await TxFn.commit(details);
            console.log("Paystack deposit committed. Details > ", details);
            return details;
        },
        async send(data: TxDepositSendRequest): Promise<TxDeposit> {
            const details = await TxAccountDepositFn.create.send(data);
            await TxFn.commit(details);
            return details;
        },
        async momo(data: TxDepositMoMoRequest): Promise<TxDeposit> {
            const details = await TxAccountDepositFn.create.momo(data);
            await TxFn.commit(details);
            return details;
        }
    }
};

export {TxAccountDepositFn};
