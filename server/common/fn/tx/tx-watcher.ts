import { TxFn } from "./tx-fn";

class TxWatcher {
    private static watchList = new Map<string, NodeJS.Timeout>();

    static addToWatch(txId: string, timeoutMinutes: number = 2) {
        // Clear existing timeout if exists
        if (this.watchList.has(txId)) {
            clearTimeout(this.watchList.get(txId)!);
        }

        const time = timeoutMinutes * 60 * 1000;
        // Set new timeout
        const timeout = setTimeout(async () => {
            try {
                const tx = await TxFn.read(txId);
                if (tx && !(tx.status === "success" || tx.status === "failed")) {
                    await TxFn.update_status_failed(txId);
                    console.log(`Auto-failed deposit: ${txId}`);
                }
            } catch (error) {
                console.error(`Error auto-failing deposit ${txId}:`, error);
            } finally {
                this.watchList.delete(txId);
            }
            console.log(`Time out executed for ${txId}`);
        }, time);

        this.watchList.set(txId, timeout);
        console.log(`Added tx ${txId} to watch list (${time}ms timeout)`);
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
