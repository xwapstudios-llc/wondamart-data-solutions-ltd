export interface IMessaging {
    $properties: {
        Messages: string[];           // Array of SMS object paths
        SupportedStorages: MMSmsStorage[];  // MMSmsStorage enums
        DefaultStorage: MMSmsStorage;       // MMSmsStorage enum
    };

    /** Create a new SMS object. Requires 'Number' and 'Text'/'Data' */
    Create(properties: { Number: string; Text?: string; Data?: Uint8Array }): Promise<string>;
    Delete(smsPath: string): Promise<void>;
    List(): Promise<string[]>;
    SetDefaultStorage(storage: MMSmsStorage): Promise<void>;

    // Signals
    on(event: 'Added', listener: (path: string, received: boolean) => void): this;
    on(event: 'Deleted', listener: (path: string) => void): this;
}