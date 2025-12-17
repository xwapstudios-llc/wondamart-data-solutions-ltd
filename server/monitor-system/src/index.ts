import os from "os";
import { collections } from "@common/lib/collections";
import { getSystemMetrics } from "@/metrics.js";
import config from "@common-server/config";

if (config.nodeEnv === "development") {
    process.env.FIRESTORE_EMULATOR_HOST = "localhost:8080"
    process.env.FIREBASE_AUTH_EMULATOR_HOST = "localhost:9099"
} else {
    delete process.env.FIRESTORE_EMULATOR_HOST;
    delete process.env.FIREBASE_AUTH_EMULATOR_HOST;
}
import {initializeApp, getApps} from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";

if (!getApps().length) {
    initializeApp();
}


const db = getFirestore();

const hostname = os.hostname();

async function logHeartbeat() {
    const heartbeatRef = db.collection(collections.heartbeats).doc(hostname);
    await heartbeatRef.set({
        lastSeen: FieldValue.serverTimestamp(),
    });
    console.log(
        `Heartbeat logged for ${hostname} at ${new Date().toISOString()}`
    );
}

async function logMetrics() {
    const serverRef = db.collection(collections.servers).doc(hostname);
    await serverRef.set({
        metrics: await getSystemMetrics(),
        timestamp: FieldValue.serverTimestamp(),
    });
    console.log(
        `Metrics logged for ${hostname} at ${new Date().toISOString()}`
    );
}

setInterval(logMetrics, 60 * 1000); // Log metrics every 60 seconds
setInterval(logHeartbeat, 5 * 1000); // Log heartbeat every 5 seconds

// Initial heartbeat log
logHeartbeat().catch(console.error);
logMetrics().catch(console.error);
