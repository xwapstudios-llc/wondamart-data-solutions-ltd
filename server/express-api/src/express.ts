import express from "express";
import config from "@common-server/config";
import {firebaseOnlyMiddleware} from "@common-server/utils/express";

const app = express();
app.use(express.json());

const port = config.port_api;
const host = config.host_local_server;

app.use(firebaseOnlyMiddleware);

app.get("/", (req, res) => {
    res.send("Hello World! from api.wondamart.com");
});

app.post("/", async (req, res) => {});

app.listen(port, () => {
    console.log(`api.wondamartgh.com running at http://${host}:${port}`);
});
