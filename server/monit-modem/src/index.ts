import { ModemManagerClient } from "./mm";

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
        console.log(`Found ${messages.length} messages.`);
        console.log(messages);

        // await mm.cancelUSSD();

        // for (const msg of messages) {
        //     const message = await mm.readSMS(msg);
        //     console.log("SMS Message:", message);
        //     // Reply with the message content back to both numbers
        //     console.log("Sending reply to both numbers...");
        //     console.log("Replying to---------------------------", ernest_number);
        //     await mm.sendSMS(ernest_number, JSON.stringify(message, null, 2));
        //
        //     setTimeout(() => {
        //         console.log("Waiting before sending to Ben...");
        //     }, 10000);
        //
        //     console.log("Replying to---------------------------", ben_number);
        //     await mm.sendSMS(ben_number, JSON.stringify(message, null, 2));
        // }

        // let message = "";
        // message = await mm.navigateUSSDMenu(cashInTo("0542956247", 3680));
        // console.log("USSD Balance Result:", message);
        // console.log("----------------------------------");
        // console.log("Waiting before sending CashOut to Ernest.........................");
        // await new Promise((resolve) => setTimeout(resolve, 5000)); // small delay to avoid overwhelming
        // await mm.sendSMS(ernest_number, `USSD Final Result:\n${message}`);
        // console.log("Message Sent----------------------------------");

        // message = await mm.navigateUSSDMenu(cashOut("0542946247", 4500));
        // console.log("USSD Balance Result:", message);
        // console.log("----------------------------------");
        // console.log("Waiting before sending CashOut to Ernest.........................");
        // await new Promise((resolve) => setTimeout(resolve, 5000)); // small delay to avoid overwhelming
        // await mm.sendSMS(ernest_number, `USSD Final Result:\n${message}`);
        // console.log("Message Sent----------------------------------");

        // message = await mm.navigateUSSDMenu(check_momo_balance);
        // console.log("USSD Balance Result:", message);
        // console.log("----------------------------------");
        // console.log("Waiting before sending Balance to Ernest.........................");
        // await new Promise((resolve) => setTimeout(resolve, 5000)); // small delay to avoid overwhelming
        // await mm.sendSMS(ernest_number, `USSD MoMo Balance:\n${message}`);
        // console.log("Message Sent----------------------------------");

    } catch (err) {
        // @ts-ignore
        console.error("Operation failed:", err.message);
    } finally {
        // Always clean up to leave the modem ready for the next run
        await mm.cancelUSSD();
    }
}

main().catch(console.error);
