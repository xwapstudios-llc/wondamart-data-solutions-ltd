
import config from "@common-server/config";

if (config.nodeEnv === "development") {
    process.env.FIRESTORE_EMULATOR_HOST = "localhost:8080"
    process.env.FIREBASE_AUTH_EMULATOR_HOST = "localhost:9099"
} else {
    delete process.env.FIRESTORE_EMULATOR_HOST;
    delete process.env.FIREBASE_AUTH_EMULATOR_HOST;
}
import {initializeApp, getApps, cert} from "firebase-admin/app";


if (!getApps().length) {
    initializeApp({
        credential: cert(
            JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS as string)
        ),
    });
}