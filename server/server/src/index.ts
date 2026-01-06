import "./app"
import { modemManager } from "./modem/modem-manager";
import "@/express";

async function main() {
    await modemManager.init();

    try {
        const messages = await modemManager.listSMS();
        console.log(`Found ${messages.length} messages.`);
        console.log(messages);
    } catch (err) {
        // @ts-ignore
        console.error("Operation failed:", err.message);
    } finally {
        await modemManager.cancelUSSD();
    }
}

main().catch(console.error);

console.log("Started Modem Monitor Express server");
