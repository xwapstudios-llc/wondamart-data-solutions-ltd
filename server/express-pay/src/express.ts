import express from "express";
import config from "@common-server/config";
import {TxDepositPaystackData} from "@common/types/account-deposit";
import {test_paystack} from "@/paystack";
import {currency_to_paystack_amount, networkID_to_paystack_provider} from "@/paystack/charge";
import {Tx} from "@common/types/tx";
import {TxFn} from "@common-server/fn/tx/tx-fn";
import {UserFn} from "@common-server/fn/user-fn";

const app = express();
const port = config.port_pay;
const host = config.host_server;

app.get("/", (req, res) => {
    res.send("Hello World! from pay.wondamart.com");
});

app.post("/deposit/paystack", async (req, res) => {
    const tx: Tx = req.body
    console.log("received tx for paystack", tx)
    const data = tx.data as TxDepositPaystackData;
    try {
        await TxFn.update_status_processing(tx.id);
        const r = await test_paystack({
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
        console.log(r);

        await TxFn.update_status_completed(tx.id);
        await UserFn.update_UserWalletBalance(tx.uid, tx.amount);

        res.status(200).send(r);
    } catch (e: {status: string, reference?: string, message: string} | any) {
        console.error(e);
        await TxFn.update_status_failed(tx.id);
        res.status(500).send({...e})
    }
});

app.listen(port, () => {
    console.log(`pay.wondamart.com running at http://${host}:${port}`);
});
