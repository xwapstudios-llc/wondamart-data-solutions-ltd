import { Timestamp } from "@google-cloud/firestore";

export type ServerNotificationType =
    "tx"
    | "tx_db"
    | "tx_af"
    | "tx_rc"
    | "tx_dp"
    | "tx_dp_paystack"
    | "tx_dp_send"
    | "tx_dp_momo";

export interface ServerHeartbeat {
    lastSeen: Timestamp;
}

interface CPUMetrics {
    model: string;
    cores: number;
    speed: string;
    load: number;
}
interface MemoryMetrics {
    total: number;
    free: number;
    used: number;
}
interface OSMetrics {
    platform: string;
    distro: string;
    release: string;
    hostname: string;
}
interface TempMetrics {
    main: number;
    max: number;
}
interface DiskMetrics {
    total: number;
    used: number;
    free: number;
}
interface BatteryMetrics {
    hasBattery: boolean;
    percent: number;
    isCharging: boolean;
    timeRemaining?: number;
}
export interface SystemMetrics {
    cpu: CPUMetrics;
    memory: MemoryMetrics;
    os: OSMetrics;
    temp: TempMetrics;
    disk: DiskMetrics;
    battery: BatteryMetrics;
    uptime: number;
}

export interface ServerStatus {
    metrics: SystemMetrics;
    timestamp: Timestamp;
}