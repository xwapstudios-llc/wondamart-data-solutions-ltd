export interface ISimple {
    /** Connects the modem using a single properties object (APN, User, Pass, etc.) */
    Connect(properties: {
        apn?: string;
        user?: string;
        password?: string;
        pin?: string;
        "ip-type"?: number;
    }): Promise<string>; // Returns Bearer path

    Disconnect(bearerPath: string): Promise<void>;
    /** Returns a high-level status dictionary (Signal, State, Registration) */
    GetStatus(): Promise<Record<string, any>>;
}