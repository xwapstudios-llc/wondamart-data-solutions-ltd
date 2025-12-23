import {ModemManagerClient} from "./mm";
import {USSDCode} from "@/types";

const check_number: USSDCode = {
    root: "*124#",
    sequence: []
}
async function main() {
    const mm = new ModemManagerClient();
    await mm.init();

    // await mm.waitForReady();

    console.log("Operator Name:", await mm.getOperatorName());
    console.log("Signal Status:", await mm.getStatus());

    try {
        // Ensure we aren't stuck in an old menu
        await mm.ensureIdle();

        const result = await mm.navigateUSSDMenu(check_number);

        console.log("Final Result:", result);

        // send message to earnest
        await mm.sendSMS("+233539971202", `USSD Check Result:\n${result}`);

    } catch (err) {
        // @ts-ignore
        console.error("Operation failed:", err.message);
    } finally {
        // Always clean up to leave the modem ready for the next run
        await mm.cancelUSSD();
    }
}

main().catch(console.error);

