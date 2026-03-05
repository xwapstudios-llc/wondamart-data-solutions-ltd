import "@/app"
import "@/express";
import {autoFailDeposits} from "@/routes/tasks";

console.log("Started Express API server with Payment functionality");

autoFailDeposits();