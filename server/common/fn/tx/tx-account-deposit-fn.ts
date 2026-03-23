import {
    TxDeposit,
    TxDepositMoMoRequest,
    TxDepositPaystackRequest,
    TxDepositSendRequest
} from "@common/types/account-deposit";
import {TxFn} from "./tx-fn";
import {txType} from "@common/tx";

const TxAccountDepositFn = {
    create: {
        async paystack(data: TxDepositPaystackRequest) {
            const txDetails: TxDeposit = {
                ...await TxFn.initialDoc(txType.paystackDeposit, data.uid),
                type: "paystack-deposit",
                amount: data.amount,
                txData: {
                    depositType: "paystack",
                    phoneNumber: data.phoneNumber,
                    email: data.email,
                    network: data.network,
                }
            };
            return txDetails;
        },
        async send(data: TxDepositSendRequest) {
            const txDetails: TxDeposit = {
                ...await TxFn.initialDoc(txType.manualDeposit, data.uid),
                type: "paystack-deposit",
                amount: 0,
                txData: {
                    depositType: "send",
                    transactionID: data.transactionID,
                }
            };
            return txDetails;
        },
        async momo(data: TxDepositMoMoRequest) {
            const txDetails: TxDeposit = {
                ...await TxFn.initialDoc(txType.paystackDeposit, data.uid),
                type: "paystack-deposit",
                amount: data.amount,
                txData: {
                    depositType: "momo",
                    phoneNumber: data.phoneNumber,
                }
            };
            return txDetails;
        }
    },
    async read_TxAccountDepositDoc(txId: string): Promise<TxDeposit> {
        return await TxFn.read(txId) as TxDeposit;
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
