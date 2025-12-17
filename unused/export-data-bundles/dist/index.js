"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
// ---------- CONFIG ----------
const COLLECTION_NAME = "data-bundles";
const OUTPUT_DIR = "./exports";
const OUTPUT_FILE = `${COLLECTION_NAME}.json`;
// ----------------------------
// Initialize Firebase Admin
firebase_admin_1.default.initializeApp({
    credential: firebase_admin_1.default.credential.applicationDefault(),
});
const db = firebase_admin_1.default.firestore();
async function exportCollectionToJson() {
    console.log(`▶ Exporting collection: ${COLLECTION_NAME}`);
    const snapshot = await db.collection(COLLECTION_NAME).get();
    if (snapshot.empty) {
        console.warn("⚠ Collection is empty. No data exported.");
        return;
    }
    const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    }));
    await promises_1.default.mkdir(OUTPUT_DIR, { recursive: true });
    const filePath = path_1.default.join(OUTPUT_DIR, OUTPUT_FILE);
    await promises_1.default.writeFile(filePath, JSON.stringify(data, null, 4), "utf-8");
    console.log(`✔ Export complete: ${filePath}`);
}
exportCollectionToJson().catch((err) => {
    console.error("✖ Export failed:", err);
    process.exit(1);
});
//# sourceMappingURL=index.js.map