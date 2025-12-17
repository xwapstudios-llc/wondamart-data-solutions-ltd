import express from "express";
import config from "./config";
import {test_paystack} from "./paystack";
import {charge} from "./paystack/charge";

const app = express();

// Bundle api
// Get -> return all data bundles
// Get :id -> return data bundle by id
// Get :network -> return data bundles by network
// Get /search?q= -> search data bundles by query
// Post -> create new data bundle
// Put :id -> update data bundle by id
// Delete :id -> delete data bundle by id

// Data purchase api
// api object: {
//   uid: string;
//   bundleId: string;
//   phoneNumber: string;
//   units: number;
// }
// api-token: string;
// Post /purchase -> purchase data bundle

app.get("/", (req, res) => {
    res.send({ ok: "Hello, World!" });
});


app.get("/paystack", async (req, res) => {
    console.log(`Received paystack test request`);
    const result = await test_paystack({
        amount: 23,
        email: "nketsiah000@gmail.com",
        mobile_money: {
            phone: "0545532789",
            provider: "mtn"
        },
        currency: "GHS"
    });
    res.send(result);
});

app.get("/paystack/otp", async (req, res) => {
    console.log(`Received paystack test request`);
    const {otp, ref} = req.query;
    if (typeof ref == "string" && typeof otp == "string") {
        const result = await charge.submit_otp(ref, otp);
        res.send(result);
    } else {
        res.status(401).send("ref or otp not defined");
    }
});


app.get("/paystack/callback", async (req, res) => {
    console.log(`Received paystack callback request`);
    console.log(`Body: ${JSON.stringify(req.body)}`);
    console.log(`Request Headers: ${JSON.stringify(req.headers)}`);
    res.send({ status: "callback received" });
});

app.get("/paystack/webhook", async (req, res) => {
    console.log(`Received paystack callback request`);
    console.log(`Body: ${JSON.stringify(req.body)}`);
    console.log(`Request Headers: ${JSON.stringify(req.headers)}`);
    res.send({ status: "callback received" });
});

app.listen(config.port, () => {
    console.log("Server started successfully.");
    console.log(`Server is running on http://localhost:${config.port}`);
});
