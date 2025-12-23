export interface IVoice {
    $properties: {
        Calls: string[];              // Array of Call object paths
        EmergencyOnly: boolean;
    };

    /** Create a new outgoing call. Requires 'Number' */
    CreateCall(properties: { Number: string }): Promise<string>;
    DeleteCall(callPath: string): Promise<void>;
    ListCalls(): Promise<string[]>;
    HangupAll(): Promise<void>;
    Transfer(): Promise<void>;

    // Signals
    on(event: 'CallAdded', listener: (path: string) => void): this;
    on(event: 'CallDeleted', listener: (path: string) => void): this;
}