import { Client } from "./types.js";

// const url = "https://api.wondamartgh.com"
const url = "http:localhost:8080"

const client = new Client(url, {
  "Content-Type": "application/json",
  Accept: "application/json",
  Authorization: "Bearer __",
});

export { client };
