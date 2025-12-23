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
        root: "*170#",
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

        // let result = await mm.navigateUSSDMenu(check_number);

        // console.log("Final Result:", result);

        // send message to earnest
        // await mm.sendSMS(ernest_number, `BALANCE Check:\n${result}`);
        // await mm.sendSMS(ben_number, `BALANCE Check:\n${result}`);

        // const res = await mm.navigateUSSDMenu(check_momo_balance);
        // console.log("MOMO Balance Result:", res);

        // await mm.sendSMS(ernest_number, `MOMO BALANCE:\n${res}`);
        // await mm.sendSMS(ben_number, `MOMO BALANCE:\n${res}`);
        
        // Read all SMS messages
        const messages = await mm.listSMS();
        console.log("All SMS Messages:", messages);

        for(const msgPath of messages) {
            console.log("-------------------------");
            console.log("Reading SMS at path:", msgPath);
            const message = await mm.readSMS(msgPath);
            console.log(`SMS ${msgPath} Content:`, JSON.stringify(message, null, 2));
            console.log("-------------------------");
            setTimeout(() => {}, 2000); // small delay
            console.log("Deleting message...");
            mm.deleteSMS(msgPath);
            console.log(`Deleted SMS at path: ${msgPath}`);
            console.log("\n\n");
        }
        // messages.forEach(async (msgPath) => {
        //     const message = await mm.readSMS(msgPath);
        //     console.log(`SMS ${msgPath} Content:`, JSON.stringify(message, null, 2));
        //     // await mm.sendSMS(ernest_number, `MESSAGE RECEIVED:\n${JSON.stringify(message, null, 2)}`);
        //     // await mm.sendSMS(ben_number, `MESSAGE RECEIVED:\n${JSON.stringify(message, null, 2)}`);
        // });

        // if (messages.length > 0) {
        //     const result = JSON.stringify(await mm.readSMS(messages[0]), null, 2);
        //     console.log(`SMS ${messages[0]} \n Content:`, result);
        //     await mm.sendSMS(ernest_number, `LAST MESSAGE RECEIVED:\n${result}`);
        //     await mm.sendSMS(ben_number, `LAST MESSAGE RECEIVED:\n${result}`);
        // } else {
        //     console.log("No SMS messages found.");
        // }

    } catch (err) {
        // @ts-ignore
        console.error("Operation failed:", err.message);
    } finally {
        // Always clean up to leave the modem ready for the next run
        await mm.cancelUSSD();
    }
}

main().catch(console.error);

