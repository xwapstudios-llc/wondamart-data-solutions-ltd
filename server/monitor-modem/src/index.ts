import {ModemManagerClient} from "./mm";

async function main() {
    const mm = new ModemManagerClient();
    await mm.init();

    // await mm.waitForReady();

    console.log("Operator Name:", await mm.getOperatorName());
    console.log("Signal Status:", await mm.getStatus());

    try {
        // Ensure we aren't stuck in an old menu
        await mm.ensureIdle();

        // Example: Check balance on a network where you dial *124# then press 1
        const finalBalance = await mm.navigateUSSDMenu("*171#", ["3", "1", "0244254373", "0244254373", "250", "5050"]);
        console.log("Final Result:", finalBalance);
        await mm.cancelUSSD();

    } catch (err) {
        // @ts-ignore
        console.error("Operation failed:", err.message);
    } finally {
        // Always clean up to leave the modem ready for the next run
        await mm.cancelUSSD();
    }
}

main().catch(console.error);

