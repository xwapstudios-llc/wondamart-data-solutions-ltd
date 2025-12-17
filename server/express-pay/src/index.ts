import "./app"
import {test_paystack} from "./paystack";
import {getFirestore, Timestamp} from "firebase-admin/firestore";
import {Tx, TxStatus} from "@common/types/tx";
import {collections} from "@common/lib/collections";
import {TxDepositPaystackData} from "@common/types/account-deposit";
import {currency_to_paystack_amount, networkID_to_paystack_provider} from "./paystack/charge";
import {TxFn} from "@common-server/fn/tx/tx-fn";
import "@/express";

const db = getFirestore();

function handleTxAdded(tx: Tx) {
    console.log("handleTxAdded", tx);
    console.log("Will update status to processing after 10 seconds");
    setTimeout(async () => {
        const newTx = await TxFn.read(tx.id);
        if (newTx.status == "pending") {
            console.log("Tx status is still 'pending' after 10 seconds");
            await TxFn.update_status_processing(tx.id);
            console.log("Updated Tx status to processing");
        } else {
            console.log("Tx status is not 'pending' after 10 seconds");
            console.log("Tx status > ", newTx.status);
        }
    }, 10 * 1000)
}

function handleTxCanceled(tx: Tx) {
    console.log("handleTxCanceled", tx);
}

function handleTxFailed(tx: Tx) {
    console.log("handleTxFailed", tx);
}

async function handleTxProcessing(tx: Tx) {
    console.log("handleTxProcessing", tx);
    const data = tx.data as TxDepositPaystackData;
    console.log("Starting to handle transaction... > ", data);
    try {
        const res = await test_paystack({
            amount: currency_to_paystack_amount(tx.amount) + (currency_to_paystack_amount(tx.amount) * 0.02),
            // callback_url: "",
            currency: "GHS",
            email: data.email,
            mobile_money: {
                phone: data.phoneNumber,
                provider: networkID_to_paystack_provider(data.network)
            },
            reference: tx.id
        });
        console.log(res);
    } catch (e: {status: string, reference?: string, message: string} | any) {
        console.error(e);
    }
}


const fourHoursAgo = () => {
    return Timestamp.fromMillis(Timestamp.now().toMillis() - 4 * 60 * 60 * 1000)
}

const doc_snapshots = (status: TxStatus) => {
    return db.collection(collections.tx)
        .where("status", "==", status)
        .where("type", "==", "deposit")
        .where("data.type", "==", "paystack")
        .where("date", ">=", fourHoursAgo())
}

// Watch on tx created
doc_snapshots("pending")
    .onSnapshot((snap) => {
        snap.docChanges().forEach(async (change) => {
            console.log("Status pending for ", change.doc.data())
            if (change.type === "added") {
                console.log("Into added on paystack pending");
                const tx = change.doc.data() as Tx;
                handleTxAdded(tx);
            }
        });
    });

// Watch on modified to failed
// doc_snapshots("failed")
//     .onSnapshot((snap) => {
//         snap.docChanges().forEach(async (change) => {
//             if (change.type === "added") {
//                 const tx = change.doc.data() as Tx;
//                 handleTxFailed(tx);
//             }
//         });
//     });


// Watch on modified to canceled
// db.collection(collections.tx)
//     .where("status", "==", "canceled")
//     .where("type", "==", "deposit")
//     .where("data.type", "==", "paystack")
//     .where("date", ">=", fourHoursAgo())
//     .onSnapshot((snap) => {
//         snap.docChanges().forEach(async (change) => {
//             if (change.type === "added") {
//                 const tx = change.doc.data() as Tx;
//                 handleTxCanceled(tx);
//             }
//         });
//     });


// Watch on modified to processing
doc_snapshots("processing")
    .onSnapshot((snap) => {
        snap.docChanges().forEach(async (change) => {
            console.log("Tx status processing. Change type > ", change.type);
            if (change.type === "added") {
                const tx = change.doc.data() as Tx;
                await handleTxProcessing(tx);
            }
        });
    });


console.log("Started Deposit Paystack");