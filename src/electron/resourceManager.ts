import osUtils from 'os-utils';
import os from 'os';
import disk from 'diskusage';

const POLLING_INTERVAL = 500;

export function pollResources() {
    setInterval(async () => {
        const cpuUsage = await getCpuUsage();
        const ramUsage = getRamUsage();
        const storageData = getStorageData();
        console.log({cpuUsage , ramUsage, storageUsage: storageData.usage });
    }, POLLING_INTERVAL);
}

export function getStaticData() {
    const totalStorage = getStorageData().total;
    const cpuModel = os.cpus()[0].model;
    const totalMemoryGB = Math.floor(osUtils.totalmem() / 1024);

    return {
        totalStorage,
        cpuModel,
        totalMemoryGB,
    };
}

function getCpuUsage() {
    return new Promise(resolve => {
        osUtils.cpuUsage(resolve) 
    });
}

function getRamUsage() {
    return 1 - osUtils.freememPercentage();
}


function getStorageData() {
    const pathToCheck = process.platform === 'win32' ? 'C:/' : '/';
    try {
        const { available, total } = disk.checkSync(pathToCheck);
        return {
            total: Math.floor(total / 1_000_000_000),
            usage: 1 - available / total
        };
    } catch (err) {
        console.error(err);
        return { total: 0, usage: 0 };
    }
}