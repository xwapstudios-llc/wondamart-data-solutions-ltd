import express from "express";
import config from "@common-server/config";
import { TxDepositPaystackData } from "@common/types/account-deposit";
import { test_paystack } from "@/paystack";
import {
    currency_to_paystack_amount,
    networkID_to_paystack_provider,
} from "@/paystack/charge";
import { TxFn } from "@common-server/fn/tx/tx-fn";
import { UserFn } from "@common-server/fn/user-fn";
import crypto from "crypto";
import {HTTPResponse, httpResponse, httpStatusCode} from "@common/types/request";

const app = express();
app.use(express.json());

const port = config.port_pay;
const host = config.host_server;

app.get("/", (req, res) => {
    res.send("Hello World! from pay.wondamart.com");
});

app.post("/deposit/paystack", async (req, res) => {
    const tx = req.body;

    if (!tx?.id || !tx?.amount || !tx?.uid) {
        const http_res = httpResponse(
            "invalid-data",
            {
                title: "Invalid data in request",
                message: "Request expected a valid transaction id, an amount and a valid user id.",
            }
        )
        return res.status(http_res.code).json(http_res);
    }

    console.log("Received tx for Paystack:", tx);

    try {
        await TxFn.update_status_processing(tx.id);

        const data = tx.data as TxDepositPaystackData;

        const response = await test_paystack({
            amount: currency_to_paystack_amount(tx.amount) * 1.02, // fee uplift
            currency: "GHS",
            email: data.email,
            mobile_money: {
                phone: data.phoneNumber,
                provider: networkID_to_paystack_provider(data.network),
            },
            reference: tx.id,
        });

        return res.status(response.code).json(response);
    } catch (err: unknown) {
        console.error("Paystack init failed:", err);
        await TxFn.update_status_failed(tx.id);

        return res
            .status(httpStatusCode["error"])
            .json(err);
    }
});

app.post(
    "/webhooks/paystack",
    express.raw({ type: "*/*" }),
    async (req, res) => {
        const signature = req.headers["x-paystack-signature"] as string;

        const hash = crypto
            .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY!)
            .update(req.body)
            .digest("hex");

        if (hash !== signature) {
            console.warn("Invalid Paystack signature");
            return res.sendStatus(401);
        }

        const event = JSON.parse(req.body.toString());

        if (event.event !== "charge.success") {
            return res.sendStatus(200);
        }

        const { reference, amount } = event.data;

        // Idempotency guard
        const tx = await TxFn.read(reference);
        if (!tx || tx.status === "completed") {
            return res.sendStatus(200);
        }

        await TxFn.update_status_completed(reference);
        await UserFn.update_UserWalletBalance(tx.uid, tx.amount);

        return res.sendStatus(200);
    },
);

app.listen(port, () => {
    console.log(`pay.wondamartgh.com running at http://${host}:${port}`);
});
