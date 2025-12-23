import dbus, {ProxyObject, Variant} from "dbus-next";
import {ben_number, ernest_number, SMSMessage, USSDCode} from "@/types";

type USSDState = 1 | 2 | 3 | 4;

export class ModemManagerClient {
    private systemBus = dbus.systemBus();
    private modemPath: string = "";
    private mmInterface: ProxyObject | null = null;
    private ussdState: USSDState = 1;

    async init() {
        const obj = await this.systemBus.getProxyObject(
            "org.freedesktop.ModemManager1",
            "/org/freedesktop/ModemManager1"
        );

        // FIX: Use the ObjectManager interface to find modems
        const manager = obj.getInterface("org.freedesktop.DBus.ObjectManager");

        // GetManagedObjects returns a dictionary of paths and their interfaces
        const managedObjects = await manager.GetManagedObjects();

        const modemPaths = Object.keys(managedObjects);

        if (modemPaths.length === 0) {
            throw new Error("No modem detected by ModemManager.");
        }

        // Use the first available modem path
        // Note: Usually paths look like /org/freedesktop/ModemManager1/Modem/0
        this.modemPath =
            modemPaths.find((path) => path.includes("/Modem/")) ||
            modemPaths[0];

        this.mmInterface = await this.systemBus.getProxyObject(
            "org.freedesktop.ModemManager1",
            this.modemPath
        );

        const ussdInterface = this.mmInterface.getInterface(
            "org.freedesktop.ModemManager1.Modem.Modem3gpp.Ussd"
        );
        ussdInterface.on("StateChanged", this.onUSSDStateChange.bind(this));

        const messaging = this.mmInterface.getInterface(
            "org.freedesktop.ModemManager1.Modem.Messaging"
        );
        messaging.on("Added", this.onNewMessage.bind(this));


        const modem = this.mmInterface.getInterface(
            "org.freedesktop.ModemManager1.Modem"
        );


        console.log("Connected to modem:", this.modemPath);
    }

    async onUSSDStateChange(newState: number) {
        this.ussdState = newState as USSDState;
        const states = {
            1: "Idle",
            2: "Active (Waiting for Network)",
            3: "User Response (Menu Open)",
            4: "Closing",
        };
        // @ts-ignore
        console.log(`Modem USSD State Changed: ${states[newState] || newState}`);
    }

    async onNewMessage(msgPath: string) {
        console.log("New SMS at:", msgPath);
        const message = await this.readSMS(msgPath);
        const result = JSON.stringify(message, null, 2);
        console.log("----------------------------------");
        console.log("SMS Content:", result);

        // Only notify for incoming messages (State: 1=RECEIVING, 2=RECEIVED)
        if (message.status === 1 || message.status === 2) {
            console.log("Sending SMS notifications...");
            await this.sendSMS(
                ernest_number,
                `NEW MESSAGE RECEIVED:\n${result}`
            );
            await new Promise((resolve) => setTimeout(resolve, 1000)); // small delay to avoid overwhelming
            await this.sendSMS(ben_number, `NEW MESSAGE RECEIVED:\n${result}`);
        } else {
            console.log("Ignoring outgoing SMS.");
        }
    }

    // *** USSD Operations ***
    async sendUSSD(code: string): Promise<string> {
        if (!this.mmInterface) throw new Error("Call init() first.");

        const ussd = this.mmInterface.getInterface(
            "org.freedesktop.ModemManager1.Modem.Modem3gpp.Ussd"
        );

        try {
            // Initiate returns the result string directly from the network
            console.log(`Sending USSD code: ${code}...`);
            return await ussd.Initiate(code);
        } catch (err) {
            console.error("USSD Error:", err);
            throw err;
        }
    }

    async respondUSSD(response: string) {
        const ussd = this.mmInterface!.getInterface(
            "org.freedesktop.ModemManager1.Modem.Modem3gpp.Ussd"
        );

        // Capture and return the next screen text
        return await ussd.Respond(response);
    }

    async cancelUSSD() {
        try {
            const ussd = this.mmInterface!.getInterface(
                "org.freedesktop.ModemManager1.Modem.Modem3gpp.Ussd"
            );
            await ussd.Cancel();
        } catch (e) {
            // Ignore errors if there was no session to cancel
            console.log("No active USSD session to cancel.");
        }
    }

    async ensureIdle() {
        if (this.ussdState !== 1) {
            console.log(
                "Modem is busy. Attempting to cancel previous session..."
            );
            await this.cancelUSSD();
            // Small delay to allow ModemManager to process the cancellation
            await new Promise((resolve) => setTimeout(resolve, 1000));
        }
    }

    async navigateUSSDMenu(ussd: USSDCode): Promise<string> {
        // 1. Start the session
        let lastResponse = await this.sendUSSD(ussd.root);
        console.log("Initial Response:", lastResponse);

        // 2. Walk through the options
        if (!ussd.sequence || ussd.sequence.length === 0) {
            return lastResponse;
        }
        for (const option of ussd.sequence) {
            console.log(`Selecting option: ${option}`);
            lastResponse = await this.respondUSSD(option);
            console.log("Next Screen:", lastResponse);
        }

        return lastResponse;
    }

    // *** SMS ***
    async listSMS() {
        const modem = this.mmInterface!.getInterface(
            "org.freedesktop.ModemManager1.Modem.Messaging"
        );
        const messages: string[] = await modem.List();
        return messages;
    }

    async readSMS(smsPath: string): Promise<SMSMessage> {
        const smsObj = await this.systemBus.getProxyObject(
            "org.freedesktop.ModemManager1",
            smsPath
        );

        const propertiesInterface = smsObj.getInterface(
            "org.freedesktop.DBus.Properties"
        );

        const properties = await propertiesInterface.GetAll(
            "org.freedesktop.ModemManager1.Sms"
        );

        return {
            number: properties["Number"].value,
            text: properties["Text"].value,
            timestamp: properties["Timestamp"].value,
            status: properties["State"].value,
        };
    }

    async sendSMS(number: string, text: string) {
        const messaging = this.mmInterface!.getInterface(
            "org.freedesktop.ModemManager1.Modem.Messaging"
        );

        // 1. Create the SMS object on the modem
        const msgProperties = {
            number: new Variant("s", number),
            text: new Variant("s", text),
        };

        console.log(`Creating SMS to ${number}...`);
        const smsPath = await messaging.Create(msgProperties);

        // 2. Get the Proxy Object for the specific message we just created
        const smsObj = await this.systemBus.getProxyObject(
            "org.freedesktop.ModemManager1",
            smsPath
        );

        const smsInterface = smsObj.getInterface(
            "org.freedesktop.ModemManager1.Sms"
        );

        // 3. Actually transmit it
        console.log("Sending SMS...");
        await smsInterface.Send();

        console.log("SMS sent successfully!");
    }

    async deleteSMS(smsPath: string) {
        const messaging = this.mmInterface!.getInterface(
            "org.freedesktop.ModemManager1.Modem.Messaging"
        );

        console.log("Deleting SMS at:", smsPath);
        await messaging.Delete(smsPath);
        console.log("SMS deleted.");
    }

    // ** Signal Strength *//
    async getStatus() {
        const modem = this.mmInterface!.getInterface(
            "org.freedesktop.ModemManager1.Modem"
        );

        // State: 8 = Registered, 9 = Connected
        const state = await modem.State;

        // Signal Quality: returns [quality_percentage, is_recent]
        const signal = await modem.SignalQuality;

        // console.log("Modem :: ", modem)
        console.log("Type of state:", state);
        console.log("Type of state:", typeof state);
        console.log("Type of signal:", signal);
        console.log("Type of signal:", typeof signal);

        return {
            state: state,
            signal: signal, // 0-100 percentage
            // @ts-ignore
            isRegistered: state >= 8,
        };
    }

    async getOperatorName(): Promise<Function> {
        const modem3gpp = this.mmInterface!.getInterface(
            "org.freedesktop.ModemManager1.Modem.Modem3gpp"
        );
        return await modem3gpp.OperatorName;
    }

    async waitForReady(timeoutMs: number = 30000) {
        const startTime = Date.now();

        while (Date.now() - startTime < timeoutMs) {
            const status = await this.getStatus();
            if (status.isRegistered) {
                console.log(`Ready! Signal: ${status.signal}%`);
                return true;
            }
            console.log("Waiting for network registration...");
            await new Promise((r) => setTimeout(r, 2000));
        }
        throw new Error("Modem failed to register within timeout.");
    }
}
