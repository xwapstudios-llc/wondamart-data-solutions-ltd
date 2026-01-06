import { RouteHandler, sendResponse } from "@common-server/express";
import { httpResponse } from "@common/types/request";
import { Timestamp } from "firebase-admin/firestore";
import { txCollections } from "@common-server/fn/collections";

export const autoFailDeposits: RouteHandler = async (req, res) => {
    try {
        const fiveMinutesAgo = Timestamp.fromMillis(Date.now() - 5 * 60 * 1000);

        const snapshot = await txCollections
            .where("type", "==", "deposit")
            .where("status", "in", ["pending", "processing"])
            .where("date", "<=", fiveMinutesAgo)
            .get();

        if (snapshot.empty) {
            return sendResponse(res, httpResponse("ok", "No stale deposits found"));
        }

        const now = Timestamp.now();
        const updates: Promise<FirebaseFirestore.WriteResult>[] = [];

        snapshot.forEach((doc: FirebaseFirestore.QueryDocumentSnapshot<FirebaseFirestore.DocumentData>) => {
            updates.push(
                txCollections.doc(doc.id).set(
                    {
                        status: "failed",
                        updatedAt: now,
                        finishedAt: now,
                    },
                    { merge: true }
                )
            );
        });

        await Promise.all(updates);
        sendResponse(res, httpResponse("ok", `Failed ${updates.length} stale deposits`));
    } catch (err) {
        console.error("autoFailDeposits error:", err);
        sendResponse(res, httpResponse("error", "Failed to process stale deposits"));
    }
};