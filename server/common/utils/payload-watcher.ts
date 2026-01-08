import { randomUUID } from "crypto";

type PayloadFunction = () => void | Promise<void>;

class PayloadWatcher {
    private static watchList = new Map<string, { timeout: NodeJS.Timeout; payload: PayloadFunction }>();

    static addToWatch(payload: PayloadFunction, timeoutMinutes: number = 5, id?: string): string {
        const watchId = id || randomUUID();
        
        // Clear existing timeout if exists
        if (this.watchList.has(watchId)) {
            clearTimeout(this.watchList.get(watchId)!.timeout);
        }

        // Set new timeout
        const timeout = setTimeout(async () => {
            try {
                await payload();
            } catch (error) {
                console.error(`Error executing payload ${watchId}:`, error);
            } finally {
                this.watchList.delete(watchId);
            }
        }, timeoutMinutes * 60 * 1000);

        this.watchList.set(watchId, { timeout, payload });
        return watchId;
    }

    static removeFromWatch(id: string): boolean {
        const entry = this.watchList.get(id);
        if (entry) {
            clearTimeout(entry.timeout);
            this.watchList.delete(id);
            return true;
        }
        return false;
    }

    static getPayload(id: string): PayloadFunction | undefined {
        return this.watchList.get(id)?.payload;
    }

    static isWatched(id: string): boolean {
        return this.watchList.has(id);
    }

    static getWatchedCount(): number {
        return this.watchList.size;
    }
}

export { PayloadWatcher };