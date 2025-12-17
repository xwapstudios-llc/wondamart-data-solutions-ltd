import { getFirestore } from "firebase-admin/firestore";
import {collections} from "@common/lib/collections";
import {txPrefix, TxType} from "@common/types/tx";

const db = getFirestore();

let latestTimestamp: number = -1;
let sequence: number = 0;
const LENGTH = 14;

function generateSortableId(length: number): string {
    const timestamp = Date.now();

    if (timestamp === latestTimestamp) {
        sequence = (sequence + 1) & 0xFFF; // 12-bit sequence (0-4095 per ms)

        if (sequence === 0) {
            // spin until next ms
            while (Date.now() <= latestTimestamp) {}
        }
    } else sequence = 0;

    latestTimestamp = timestamp;

    // Structure: [timestamp][machineId][sequence]
    const raw = BigInt(timestamp) << BigInt(22) << BigInt(12) |
        BigInt(sequence);

    // Convert to string
    let id = raw.toString();
    if (id.length > length) {
        id = id.substring(0, length);
    } else if (id.length < length) {
        id = id.padEnd(length, "0");
    }
    return id;
}

export async function generateTxID(type: TxType): Promise<string> {
    let id = txPrefix(type) + generateSortableId(LENGTH);
    let ref = await db.collection(collections.tx).doc(id).get();
    while (ref.exists) {
        id = generateSortableId(LENGTH);
        ref = await db.collection(collections.tx).doc(id).get();
    }
    return id;
}

