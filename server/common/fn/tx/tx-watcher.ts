import { TxFn } from "./tx-fn";

class TxWatcher {
    private static watchList = new Map<string, NodeJS.Timeout>();

    static addToWatch(txId: string, timeoutMinutes: number = 5) {
        // Clear existing timeout if exists
        if (this.watchList.has(txId)) {
            clearTimeout(this.watchList.get(txId)!);
        }

        // Set new timeout
        const timeout = setTimeout(async () => {
            try {
                const tx = await TxFn.read(txId);
                if (tx && tx.status === "pending") {
                    await TxFn.update_status_failed(txId);
                    console.log(`Auto-failed deposit: ${txId}`);
                }
            } catch (error) {
                console.error(`Error auto-failing deposit ${txId}:`, error);
            } finally {
                this.watchList.delete(txId);
            }
        }, timeoutMinutes * 60 * 1000);

        this.watchList.set(txId, timeout);
        console.log(`Added tx ${txId} to watch list (${timeoutMinutes}min timeout)`);
    }

    static removeFromWatch(txId: string) {
        const timeout = this.watchList.get(txId);
        if (timeout) {
            clearTimeout(timeout);
            this.watchList.delete(txId);
            console.log(`Removed tx ${txId} from watch list`);
        }
    }

    static getWatchedCount(): number {
        return this.watchList.size;
    }
}

export { TxWatcher };