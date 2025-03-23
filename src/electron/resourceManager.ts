import osUtils from 'os-utils/lib/osutils.js';
import os from 'os';
import disk from 'diskusage/index.js';
import { BrowserWindow } from 'electron';
import { ipcWebContentsSend } from './util.js';

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
