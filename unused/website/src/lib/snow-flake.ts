class Snowflake {
    private lastTimestamp = -1;
    private sequence = 0;
    private readonly machineId: number;

    constructor(machineId: number) {
        this.machineId = machineId & 0x3FF; // 10 bits
    }

    private currentTimestamp(): number {
        return Date.now();
    }

    generate(): string {
        let ts = this.currentTimestamp();

        if (ts === this.lastTimestamp) {
            this.sequence = (this.sequence + 1) & 0xFFF;
            if (this.sequence === 0) {
                while (ts <= this.lastTimestamp) {
                    ts = this.currentTimestamp();
                }
            }
        } else {
            this.sequence = 0;
        }

        this.lastTimestamp = ts;

        const id =
            (BigInt(ts) << BigInt(22)) |
            (BigInt(this.machineId) << BigInt(12)) |
            BigInt(this.sequence);

        return id.toString();
    }
}

export const UUID = new Snowflake(1);
