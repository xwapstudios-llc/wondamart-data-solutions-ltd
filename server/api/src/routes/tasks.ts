import { RouteHandler, sendResponse } from "@common-server/express";
import { httpResponse } from "@common/types/request";
import { Timestamp } from "firebase-admin/firestore";
import { txCollections } from "@common-server/fn/collections";

export const autoFailDeposits = async () => {
    try {
        const fiveMinutesAgo = Timestamp.fromMillis(Date.now() - 5 * 60 * 1000);

        const snapshot = await txCollections
            .where("type", "in", ["paystack-deposit", "manual-deposit"])
            .where("status", "in", ["pending", "processing"])
            .where("time", "<=", fiveMinutesAgo)
            .get();

        if (snapshot.empty) {
            console.log("No stale deposits found");
        }

        const now = Timestamp.now();
        const updates: Promise<FirebaseFirestore.WriteResult>[] = [];

        snapshot.forEach((doc: FirebaseFirestore.QueryDocumentSnapshot<FirebaseFirestore.DocumentData>) => {
            updates.push(
                txCollections.doc(doc.id).set(
                    {
                        status: "failed",
                        timeCompleted: now,
                    },
                    { merge: true }
                )
            );
        });

        await Promise.all(updates);
        console.log(`Failed ${updates.length} stale deposits`);
    } catch (err) {
        console.error("autoFailDeposits error:", err);
        console.log("Failed to process stale deposits");
    }
};