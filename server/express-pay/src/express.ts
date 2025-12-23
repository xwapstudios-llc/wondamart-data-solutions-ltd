import express from "express";
import config from "@common-server/config";
import {TxDepositPaystackData, TxSubmitOTPRequest} from "@common/types/account-deposit";
import {test_paystack} from "@/paystack";
import {charge, currency_to_paystack_amount, networkID_to_paystack_provider,} from "@/paystack/charge";
import {TxFn} from "@common-server/fn/tx/tx-fn";
import {UserFn} from "@common-server/fn/user-fn";
import crypto from "crypto";
import {HTTPResponse, httpResponse, httpStatusCode} from "@common/types/request";
import {Tx} from "@common/types/tx";

const app = express();
app.use(express.json());

const port = config.port_pay;
const host = config.host_server;

app.get("/", (req, res) => {
    res.send("Hello World! from pay.wondamart.com");
});

app.post("/deposit/paystack", async (req, res) => {
    const tx = req.body as Tx;

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

app.post("/deposit/paystack/submit-otp", async (req, res) => {
    const {txID, otp, uid} = req.body as TxSubmitOTPRequest;

    console.log("-----------------------------------------------")
    console.log("paystack/submit-otp data:", req.body);
    console.log("-----------------------------------------------")
    if (!txID || !otp) {
        const http_res = httpResponse(
            "invalid-data",
            {
                title: "Invalid data in request",
                message: "Request expected a valid transaction reference and an otp.",
            }
        )
        return res.status(http_res.code).json(http_res);
    }

    try {
        console.log(`Received OTP submission for reference ${txID}: ${otp}`);
        const response = await charge.submit_otp(txID, otp);

        if (response.error) {
            const http_res: HTTPResponse = {
                code: httpStatusCode["error"],
                status: "error",
                message: {
                    title: "Failed to submit OTP",
                    message: `An error occurred while submitting the OTP: ${response.error}`,
                },
            };
            return res.status(http_res.code).json(http_res);
        }
        const http_res: HTTPResponse = {
            code: httpStatusCode["ok"],
            status: "ok",
            message: "OTP submitted successfully.",
        };
        return res.status(http_res.code).json(http_res);
    } catch (err: unknown) {
        console.error("Paystack OTP submission failed:", err);

        return res
            .status(httpStatusCode["error"])
            .json(err);
    }
});

app.post("/deposit/paystack/resend-otp", async (req, res) => {
});

app.post(
    "/webhooks/paystack",
    express.raw({type: "*/*"}),
    async (req, res) => {
        const signature = req.headers["x-paystack-signature"] as string;

        console.log("Received Paystack webhook ------------------------------------");
        console.log(JSON.stringify(req.body, null, 2));
        console.log("------------------------------------");

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

        const {reference, amount} = event.data;

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
