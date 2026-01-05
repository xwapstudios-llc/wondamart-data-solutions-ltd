export interface IUssd {
    $properties: {
        State: MMModem3gppUssdSessionState;                // MMModem3gppUssdSessionState
        NetworkNotification: string;
        NetworkRequest: string;
    };

    /** Start a USSD session */
    Initiate(command: string): Promise<string>;
    /** Respond to a network-initiated USSD request */
    Respond(response: string): Promise<string>;
    Cancel(): Promise<void>;
}