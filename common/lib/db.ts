import {
    getFirestore,
    connectFirestoreEmulator,
} from "firebase/firestore";
import app from "@common/lib/app";

export const db = getFirestore(app);
connectFirestoreEmulator(db, "localhost", 8080);
export {collections} from "@common/lib/collections";

// ------ References ------
