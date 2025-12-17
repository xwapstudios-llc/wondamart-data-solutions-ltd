import { DataBundle } from "@common/types/data-bundle";
import { Timestamp } from "firebase-admin/firestore";
import {deletedDataBundleCollections} from "../collections";
import {DataBundleFn} from "./data-bundle-fn";

class DeletedDataBundleFn {
    static async create(d: DataBundle): Promise<void> {
        let bundleDocRef = deletedDataBundleCollections.doc(d.id);

        // Check if the Data Bundle document already exists.
        let bundleDoc = await bundleDocRef.get();
        let count = 0;
        while (bundleDoc.exists) {
            // If the user document exists, get a new id.
            count++;
            bundleDocRef = deletedDataBundleCollections.doc(`${bundleDoc.id}-${count}`);
            bundleDoc = await bundleDocRef.get();
        }

        // Initialize the info document.
        await bundleDocRef.set(
            {
                ...d,
                deletedAt: Timestamp.now(),
            },
            { merge: true }
        );
    }
    static async read(uid: string): Promise<DataBundle> {
        const ref = deletedDataBundleCollections.doc(uid)
        const doc = await ref.get();
        if (!doc.exists) {
            throw new Error("Data Bundle doesn't exist");
        }
        return doc.data() as DataBundle;
    }
    static async restore(uid: string): Promise<void> {
        const dataBundle = await this.read(uid);
        await DataBundleFn.create(dataBundle);
        await this.delete(uid);
    }
    static async delete(uid: string): Promise<void> {
        const ref = deletedDataBundleCollections.doc(uid)
        const doc = await ref.get();
        if (doc.exists) {
            await ref.delete();
        }
    }
}

export default DeletedDataBundleFn;