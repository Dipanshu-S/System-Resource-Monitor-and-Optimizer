import osUtils from 'os-utils/lib/osutils.js';
import os from 'os';
import disk from 'diskusage/index.js';
import { BrowserWindow } from 'electron';
import { ipcWebContentsSend } from './util.js';
import si from 'systeminformation/lib/index.js';

const POLLING_INTERVAL = 500;

export function pollResources(mainWindow: BrowserWindow) {
  setInterval(async () => {
    const cpuUsage = await getCpuUsage();
    const ramUsage = getRamUsage();
    const storageData = getStorageData();
    ipcWebContentsSend('statistics', mainWindow.webContents, {
      cpuUsage,
      ramUsage,
      storageUsage: storageData.usage,
    });
  }, POLLING_INTERVAL);
}

export function getStaticData() {
  const totalStorage = getStorageData().total;
  const cpuModel = os.cpus()[0].model;
  const totalMemoryGB = Math.floor(os.totalmem() / (1024 * 1024 *1024) );

  return {
    totalStorage,
    cpuModel,
    totalMemoryGB,
  };
}

export async function getBatteryData() {
  // Check if battery information is available.
  try {
    const battery = await si.battery();
    if (!battery.hasBattery) {
      return null;
    }
    // For simplicity, we simulate a 12‑hour history by making 72 identical entries of the current battery percentage.
    // In a real-world app, you might store historical battery data over time.
    const history = Array(72).fill(battery.percent);
    return {
      history,
      isCharging: battery.isCharging,
    };
  } catch (err) {
    console.error('Error fetching battery data:', err);
    return null;
  }
}

export async function getRunningApps() {
  try {
    // Retrieve processes data
    const processData = await si.processes();
    // Filter out system processes (for example, those running as 'SYSTEM' or 'root')
    const apps = processData.list.filter(p => p.user && !['SYSTEM', 'root'].includes(p.user));
    return apps.map((p, index) => ({
      srNo: index + 1,
      appName: p.name,
      currentCpuUsage: p.cpu,
      memoryConsumption: p.mem,
      permissionsAllowed: "Standard"  // Placeholder; adjust if you have specific permission data
    }));
  } catch (err) {
    console.error('Error fetching running apps:', err);
    return [];
  }
}

function getCpuUsage(): Promise<number> {
  return new Promise((resolve) => {
    osUtils.cpuUsage(resolve);
  });
}

function getRamUsage(): number {
  return 1 - osUtils.freememPercentage();
}

function getStorageData() {
  const pathToCheck = process.platform === 'win32' ? 'C:/' : '/';
  try {
    const { available, total } = disk.checkSync(pathToCheck);
    return {
      total: Math.floor(total / (1024 * 1024 * 1024)),
      usage: 1 - available / total,
    };
  } catch (err) {
    console.error(err);
    return { total: 0, usage: 0 };
  }
}