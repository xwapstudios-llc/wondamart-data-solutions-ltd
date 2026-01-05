export interface ILocation {
    $properties: {
        Capabilities: number;         // Bitmask of MMModemLocationSource
        SupportedAssistanceData: number;
        Enabled: number;              // Currently enabled sources
        SignalsLocation: boolean;     // Whether to emit signals for updates
        Location: Record<number, any>; // Dictionary of location data by source
    };

    /** Configure location sources (e.g., GPS, 3GPP Lac/Ci) */
    Setup(sources: number, signalLocation: boolean): Promise<void>;
    /** Get current location dictionary */
    GetLocation(): Promise<Record<number, any>>;
    SetGpsRefreshRate(rate: number): Promise<void>;
    SetSuplServer(supl: string): Promise<void>;
}