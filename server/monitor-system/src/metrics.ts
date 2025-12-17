import si from "systeminformation";
import os from "os";
import { SystemMetrics } from "@common/types/server.js";


export async function getSystemMetrics(): Promise<SystemMetrics> {
    const cpu = await si.cpu();
    const mem = await si.mem();
    const osInfo = await si.osInfo();
    const load = await si.currentLoad();
    const uptime = si.time().uptime;
    const temp = await si.cpuTemperature();
    const diskData = await si.fsSize();
    const disk = diskData[0];
    const battery = await si.battery();

    return {
        cpu: {
            model: cpu.manufacturer + " " + cpu.brand,
            cores: cpu.cores,
            speed: cpu.speed + " GHz",
            load: parseFloat(load.currentLoad.toFixed(2)),
        },
        memory: {
            total: mem.total,
            free: mem.free,
            used: mem.used,
        },
        os: {
            platform: osInfo.platform,
            distro: osInfo.distro,
            release: osInfo.release,
            hostname: os.hostname(),
        },
        temp: {
            main: parseFloat(temp.main.toFixed(2)),
            max: parseFloat(temp.max.toFixed(2)),
        },
        disk: {
            total: disk.size,
            used: disk.used,
            free: disk.size - disk.used,
        },
        battery: {
            hasBattery: battery.hasBattery,
            percent: parseFloat(battery.percent.toFixed(2)),
            isCharging: battery.isCharging,
            timeRemaining: battery.timeRemaining,
        },
        uptime: uptime,
    };
}