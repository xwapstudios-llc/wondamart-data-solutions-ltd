import { read } from "node:fs";
import {ModemManagerClient} from "./mm";
import {USSDCode} from "@/types";

const check_number: USSDCode = {
    root: "*124#",
    sequence: []
}

const check_momo_balance: USSDCode = {
    root: "*171#",
    sequence: ["7", "1", "5050"]  // For MTN Ghana
}

const sms_path = "/org/freedesktop/ModemManager1/SMS/220";
const ernest_number = "+233539971202";
const ben_number = "+233545532789";

async function main() {
    const mm = new ModemManagerClient();
    await mm.init();

    // await mm.waitForReady();

    console.log("Operator Name:", await mm.getOperatorName());
    console.log("Signal Status:", await mm.getStatus());

    try {
        // Ensure we aren't stuck in an old menu
        await mm.ensureIdle();

        // let result = await mm.navigateUSSDMenu(check_number);

        // console.log("Final Result:", result);

        // send message to earnest
        // await mm.sendSMS(ernest_number, `BALANCE Check:\n${result}`);
        // await mm.sendSMS(ben_number, `BALANCE Check:\n${result}`);

        let messages = await mm.listSMS();
        console.log("All SMS Messages:", messages);

        if (messages.length > 0) {
            let result = await mm.readSMS(messages[0]);
            console.log(`SMS ${messages[0]} \n Content:`, result);
            await mm.sendSMS(ernest_number, `MESSAGE_RECEIVED:\n${result}`);
            await mm.sendSMS(ben_number, `MESSAGE_RECEIVED:\n${result}`);
        } else {
            console.log("No SMS messages found.");
        }

    } catch (err) {
        // @ts-ignore
        console.error("Operation failed:", err.message);
    } finally {
        // Always clean up to leave the modem ready for the next run
        await mm.cancelUSSD();
    }
}

main().catch(console.error);

