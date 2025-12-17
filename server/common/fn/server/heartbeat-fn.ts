import { heartbeatsCollections } from "../collections";
import { ServerHeartbeat } from "@common/types/server";
import {Timestamp} from "firebase-admin/firestore"

const ServerHeartbeatFn = {
    read: async (hostName: string): Promise<ServerHeartbeat | null> => {
        const doc = await heartbeatsCollections.doc(hostName).get();
        if (!doc.exists) {
            return null;
        }
        return doc.data() as ServerHeartbeat;
    },
    isAlive: async (hostName: string, thresholdSeconds: number = 11): Promise<boolean> => {
        const heartbeat = await ServerHeartbeatFn.read(hostName);
        if (!heartbeat) {
            return false;
        }
        const lastSeen = heartbeat.lastSeen.toMillis();
        const now = Timestamp.now().toMillis();
        return (now - lastSeen) <= (thresholdSeconds * 1000);
    },
    allServersHeartbeats: async (): Promise<{ [hostName: string]: ServerHeartbeat }> => {
        const snapshot = await heartbeatsCollections.get();
        const result: { [hostName: string]: ServerHeartbeat } = {};
        snapshot.forEach(doc => {
            result[doc.id] = doc.data() as ServerHeartbeat;
        });
        return result;
    },
    getActiveServers: async (thresholdSeconds: number = 11): Promise<string[]> => {
        const allHeartbeats = await ServerHeartbeatFn.allServersHeartbeats();
        const now = Timestamp.now().toMillis();
        const activeServers: string[] = [];
        for (const [hostName, heartbeat] of Object.entries(allHeartbeats)) {
            const lastSeen = heartbeat.lastSeen.toMillis();
            if ((now - lastSeen) <= (thresholdSeconds * 1000)) {
                activeServers.push(hostName);
            }
        }
        return activeServers;
    },
    getFirstActiveServer: async (thresholdSeconds: number = 11): Promise<string | null> => {
        const activeServers = await ServerHeartbeatFn.getActiveServers(thresholdSeconds);
        if (activeServers.length === 0) {
            return null;
        }
        return activeServers[0];
    }
}

export {
    ServerHeartbeatFn
}