/**
 * ModemManager Enums based on Freedesktop specification
 */
export enum ModemState {
    FAILED = -1,
    UNKNOWN = 0,
    INITIALIZING = 1,
    LOCKED = 2,
    DISABLED = 3,
    DISABLING = 4,
    ENABLING = 5,
    ENABLED = 6,
    SEARCHING = 7,
    REGISTERED = 8,
    DISCONNECTING = 9,
    CONNECTING = 10,
    CONNECTED = 11
}

export enum PowerState {
    UNKNOWN = 0,
    OFF = 1,
    LOW = 2,
    ON = 3
}

export interface ModemProperties {
    Sim: string;                        // DBus Path
    SimSlots: string[];                 // Array of DBus Paths
    PrimarySimSlot: number;
    Bearers: string[];                  // Array of DBus Paths
    Manufacturer: string;
    Model: string;
    Revision: string;
    Device: string;                     // Physical device path (sysfs)
    Drivers: string[];
    Plugin: string;
    PrimaryPort: string;
    EquipmentIdentifier: string;        // IMEI/MEID
    UnlockRequired: number;             // MMModemLock enum
    State: ModemState;
    StateFailedReason: number;
    AccessTechnologies: number;         // Bitmask
    SignalQuality: [number, boolean];   // [quality %, recent_poll]
    PowerState: PowerState;
}

/**
 * Representing the ProxyInterface object
 */
export interface IModem {
    // --- Properties Accessor ---
    $properties: ModemProperties;

    // --- Methods ---
    Enable(enable: boolean): Promise<void>;
    ListBearers(): Promise<string[]>;
    CreateBearer(properties: Record<string, any>): Promise<string>;
    DeleteBearer(bearerPath: string): Promise<void>;
    Reset(): Promise<void>;
    FactoryReset(code: string): Promise<void>;
    SetPowerState(state: PowerState): Promise<void>;
    SetCurrentCapabilities(capabilities: number): Promise<void>;
    SetCurrentModes(modes: [number, number]): Promise<void>;
    SetCurrentBands(bands: number[]): Promise<void>;
    SetPrimarySimSlot(slot: number): Promise<void>;
    GetCellInfo(): Promise<Record<string, any>[]>;
    Command(cmd: string, timeout: number): Promise<string>;

    // --- Signals ---
    on(event: 'StateChanged', listener: (oldState: number, newState: number, reason: number) => void): this;
}