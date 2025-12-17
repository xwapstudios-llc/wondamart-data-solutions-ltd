import { ServerHeartbeatFn } from "./heartbeat-fn"
import {ServerNotificationType} from "@common/types/server";

const ServerFn = {
    isActive: async (): Promise<boolean> => {
        // Read server heartbeats and check if server is active in the last 11secs
        const activeServer = await ServerHeartbeatFn.getFirstActiveServer();
        return activeServer !== null;
    },
    notify: async (notification: ServerNotificationType): Promise<void> => {
        // Todo: Server Notification system
    }
}

export {
    ServerFn
}