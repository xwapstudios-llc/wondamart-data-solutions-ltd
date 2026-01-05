enum MMModemLocationSource {
    NONE = 0,
    GPP_LAC_CI = 1,
    GPS_RAW = 2,
    GPS_NMEA = 4,
    GPS_UNMANAGED = 8,
    AGPS_MSA = 16,
    AGPS_MSB = 32
}

enum MMSmsStorage {
    UNKNOWN = 0,
    SM = 1, // SIM Memory
    ME = 2, // Device Memory
    MT = 3 // Combined Memory
}

enum MMModem3gppUssdSessionState {
    IDLE = 0,
    ACTIVE = 1,
    USER_RESPONSE = 2,
    NETWORK_RESPONSE = 3
}