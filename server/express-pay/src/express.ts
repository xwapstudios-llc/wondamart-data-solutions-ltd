import express from "express";
import config from "@common-server/config";
import {TxDepositPaystackData, TxDepositPaystackRequest, TxSubmitOTPRequest} from "@common/types/account-deposit";
import {test_paystack} from "@/paystack";
import {charge, currency_to_paystack_amount, networkID_to_paystack_provider,} from "@/paystack/charge";
import {TxFn} from "@common-server/fn/tx/tx-fn";
import {UserFn} from "@common-server/fn/user-fn";
import {HTTPResponse, httpResponse, httpStatusCode} from "@common/types/request";
import crypto from "crypto";
import {firebaseOnlyMiddleware} from "@common-server/utils/express";
import {CommonSettingsFn} from "@common-server/fn/common-settings-fn";
import {ThrowCheck} from "@common-server/fn/throw-check-fn.js";
import {TxAccountDepositFn} from "@common-server/fn/tx/tx-account-deposit-fn";

const app = express();
app.use(express.json());

const port = config.port_pay;
const host = config.host_server;

app.use("/deposit", firebaseOnlyMiddleware);

app.get("/", (req, res) => {
    res.send("Hello World! from pay.wondamart.com");
});

app.post("/deposit/paystack", async (req, res) => {

    // Sanitize and validate the input data.
    let d = req.body as TxDepositPaystackRequest;

    // Do checks
    const check = new ThrowCheck(d.uid);
    await check.init();
    check.isUser();
    check.isUserDisabled();
    // check.isActivated();

    // Read settings
    const paymentSettings = await CommonSettingsFn.read_paymentMethods();
    if (!paymentSettings.paystack.enabled) {
        return httpResponse(
            "aborted",
            "This payment method is no available at the moment."
        )
    }

    // Start a transaction document
    const tx = await TxAccountDepositFn.createAndCommit.paystack(d);

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

    // Sanitize and validate the input data.
    let d = req.body as TxSubmitOTPRequest;

    // Do checks
    const check = new ThrowCheck(d.uid);
    await check.init();
    check.isUser();
    check.isUserDisabled();
    // check.isActivated();

    // Read settings
    const paymentSettings = await CommonSettingsFn.read_paymentMethods();
    if (!paymentSettings.paystack.enabled) {
        throw httpResponse(
            "aborted",
            "This payment method is no available at the moment."
        )
    }

    const {txID, otp} = d;

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

// app.post("/deposit/paystack/resend-otp", async (req, res) => {});

app.post(
    "callbacks/paystack",
    express.raw({type: "*/*"}),
    async (req, res) => {
        console.log("Received Paystack callback ------------------------------------");
        console.log(JSON.stringify(req.body, null, 2));
        console.log("------------------------------------");

        res.sendStatus(200);
    },
);

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

        const event = req.body;

        if (event.event !== "charge.success") {
            const response = httpResponse(
                "aborted",
                "Event type not supported.",
                {
                    event: event.event
                }
            )
            return res.status(response.code).json(response
            )
        }

        const {reference, amount, status, fees} = event.data;

        if (status != "success") {
            const response = httpResponse(
                "rejected",
                "Payment not successful.",
                {
                    reference: reference
                }
            )
            return res.status(response.code).json(response);
        }

        // Idempotency guard
        const tx = await TxFn.read(reference);

        const received_amount = amount - (fees || 0);
        if (received_amount < currency_to_paystack_amount(tx!.amount)) {
            const response = httpResponse(
                "aborted",
                "Received amount is less than expected.",
                {
                    reference: reference,
                    expected_amount: tx!.amount,
                    received_amount: received_amount
                }
            )
            return res.status(response.code).json(response);
        }

        if (!tx || tx.status === "completed") {
            const response = httpResponse(
                "aborted",
                "Transaction already processed.",
                {
                    reference: reference
                }
            )
            return res.status(response.code).json(response);
        }

        await TxFn.update_status_completed(reference);
        await UserFn.update_add_UserBalance(tx.uid, tx.amount);

        const response = httpResponse(
            "ok",
            "Payment processed successfully.",
            {
                reference: reference
            }
        )
        console.log("Processed Paystack payment for reference:", reference);
        return res.status(response.code).json(response);
    },
);

app.listen(port, () => {
    console.log(`pay.wondamartgh.com running at http://${host}:${port}`);
});
