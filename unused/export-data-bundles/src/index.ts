import admin from "firebase-admin";
import fs from "fs/promises";
import path from "path";

// ---------- CONFIG ----------
const COLLECTION_NAME = "data-bundles";
const OUTPUT_DIR = "./exports";
const OUTPUT_FILE = `${COLLECTION_NAME}.json`;
// ----------------------------

// Initialize Firebase Admin
admin.initializeApp({
    credential: admin.credential.applicationDefault(),
});

const db = admin.firestore();

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

    await fs.mkdir(OUTPUT_DIR, { recursive: true });

    const filePath = path.join(OUTPUT_DIR, OUTPUT_FILE);
    await fs.writeFile(filePath, JSON.stringify(data, null, 4), "utf-8");

    console.log(`✔ Export complete: ${filePath}`);
}

exportCollectionToJson().catch((err) => {
    console.error("✖ Export failed:", err);
    process.exit(1);
});
