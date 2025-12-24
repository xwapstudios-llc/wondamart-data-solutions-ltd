import {onSchedule} from "firebase-functions/v2/scheduler";
import {logger} from "firebase-functions";
import {Timestamp} from "firebase-admin/firestore";
import {txCollections} from "@common-server/fn/collections.js";

// Scheduled function that runs every minute and marks stale deposit transactions as failed
export const autoFailDeposits = onSchedule(
    {
        schedule: "*/1 * * * *", // every minute
        timeZone: "UTC",
    },
    async (event: any): Promise<void> => {
        logger.info("autoFailDeposits: triggered", {event});

        try {
            const fiveMinutesAgo = Timestamp.fromMillis(Date.now() - 5 * 60 * 1000);

            // Query for deposit transactions that are still pending or processing and older than 5 minutes
            const snapshot = await txCollections
                .where("type", "==", "deposit")
                .where("status", "in", ["pending", "processing"]) // firestore 'in' operator
                .where("date", "<=", fiveMinutesAgo)
                .get();

            if (snapshot.empty) {
                logger.info("autoFailDeposits: no stale deposits found");
                return;
            }

            const now = Timestamp.now();
            const updates: Promise<FirebaseFirestore.WriteResult>[] = [];

            snapshot.forEach((doc: FirebaseFirestore.QueryDocumentSnapshot<FirebaseFirestore.DocumentData>) => {
                logger.info("autoFailDeposits: failing tx", {id: doc.id, data: doc.data()});
                updates.push(
                    txCollections.doc(doc.id).set(
                        {
                            status: "failed",
                            updatedAt: now,
                            finishedAt: now,
                        },
                        {merge: true}
                    )
                );
            });

            await Promise.all(updates);
            logger.info(`autoFailDeposits: failed ${updates.length} tx(s)`);
        } catch (err) {
            logger.error("autoFailDeposits: error", err);
            // swallow so scheduler can continue; errors will be visible in function logs
        }
    }
);
