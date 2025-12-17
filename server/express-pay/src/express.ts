import express from "express";
import config from "@common-server/config";

const app = express();
const port = config.port_pay;
const host = config.host_server;

app.get("/", (req, res) => {
    res.send("Hello World! from pay.wondamart.com");
});

app.listen(port, () => {
    console.log(`pay.wondamart.com running at http://${host}:${port}`);
});
