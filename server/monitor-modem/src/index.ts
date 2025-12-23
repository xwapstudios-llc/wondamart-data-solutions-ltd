import {ModemManagerClient} from "./mm";
import {USSDCode, ben_number, ernest_number} from "@/types";

const check_number: USSDCode = {
    root: "*124#",
    sequence: []
}

const check_momo_balance: USSDCode = {
    root: "*171#",
    sequence: ["7", "1", "5050"]  // For MTN Ghana
}

function cashInTo(number: string, amount: number): USSDCode {
    return {
        root: "*171#",
        sequence: ["3", "1", number, number, amount.toString(), "5050"]
    }
}

const sms_path = "/org/freedesktop/ModemManager1/SMS/220";

async function main() {
    const mm = new ModemManagerClient();
    await mm.init();

    // await mm.waitForReady();

    // console.log("Operator Name:", await mm.getOperatorName());
    // console.log("Signal Status:", await mm.getStatus());

    try {
        // Ensure we aren't stuck in an old menu
        await mm.ensureIdle();

        // let result = await mm.navigateUSSDMenu(cashInTo("0244254373", 221.82));
        // console.log("Final Result:", result);

        const messages = await mm.listSMS();
        // for(const message of messages) {}
        messages.forEach(async (msg) => {
            const message = await mm.readSMS(msg);
            console.log("SMS Message:", message);
            // Reply with the message content back to both numbers
            console.log("Sending reply to both numbers...");
            console.log("Replying to---------------------------", ernest_number);
            mm.sendSMS(ernest_number, JSON.stringify(message, null, 2));
            await Promise.resolve(() => setTimeout(() => {}, 10000));
            console.log("Replying to---------------------------", ben_number);
            mm.sendSMS(ben_number, JSON.stringify(message, null, 2));
        });

    } catch (err) {
        // @ts-ignore
        console.error("Operation failed:", err.message);
    } finally {
        // Always clean up to leave the modem ready for the next run
        await mm.cancelUSSD();
    }
}

main().catch(console.error);

