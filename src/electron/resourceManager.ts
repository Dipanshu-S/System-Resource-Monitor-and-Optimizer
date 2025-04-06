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
    const processData = await si.processes();

    // Explicit list of process names to filter out when running as system processes.
    const systemProcessNames = new Set([
      "System Idle Process",
      "System",
      /^Secure System$/i,
      /^Registry$/i,
      /^smss\.exe$/i,
      /^csrss\.exe$/i,
      /^wininit\.exe$/i,
      /^services\.exe$/i,
      /^LsaIso\.exe$/i,
      /^lsass\.exe$/i,
      /^svchost\.exe$/i,
      /^WUDFHost\.exe$/i,
      /^fontdrvhost\.exe$/i,
      /^spoolsv\.exe$/i,
      /^Memory Compression$/i,
      /^winlogon\.exe$/i,
      /^dwm\.exe$/i,
      /^sihost\.exe$/i,
      /^SearchHost\.exe$/i,
      /^StartMenuExperienceHost\.exe$/i,
      /^Widgets\.exe$/i,
      /^RuntimeBroker\.exe$/i,
      /^ctfmon\.exe$/i,
      /^ipfsvc\.exe$/i,
      /^WmiPrvSE\.exe$/i,
      // Intel services
      /^IntelCpHDCPSvc\.exe$/i,
      /^IntelAnalyticsService\.exe$/i,
      /^IntelAudioService\.exe$/i,
      /^IntelConnectivityService\.exe$/i,
      /^IntelConnectService\.exe$/i,
      /^IntelConnect\.exe$/i,
      // ASUS services
      /^AsusOptimization\.exe$/i,
      /^AsusAppService\.exe$/i,
      /^AsusSystemDiagnosis\.exe$/i,
      /^AsusSwitch\.exe$/i,
      /^AsusScreenXpertHostService\.exe$/i,
      /^AsusSoftwareManager\.exe$/i,
      /^AsusSystemAnalysis\.exe$/i,
      /^AsusOptimizationStartupTask\.exe$/i,
      /^AsusScreenXpertUI\.exe$/i,
      /^AsusScreenXpertReunion\.exe$/i,
      /^AsusScreenXpertUserUI\.exe$/i,
      /^AsusOLEDShifter\.exe$/i,
      /^AsusOSD\.exe$/i,
      // Generic OEM patterns for Dell, HP, Lenovo, etc.
      /^Dell.*\.exe$/i,
      /^HP.*\.exe$/i,
      /^Lenovo.*\.exe$/i,
      // Add more patterns as needed for security or network services.
      // OEM/Service Processes:
      "GlideXServiceExt.exe",
      "GlideXRemoteService.exe",
      "GlideXNearService.exe",
      "GlideXService.exe",
      "OneApp.IGCC.WinService.exe",
      "jhi_service.exe",
      "DtsApo4Service.exe",
      "ipf_uf.exe",
      "NgcIso.exe",
      // Security & System Services:
      "RtkAudUService64.exe",
      "RstMwService.exe",
      "WMIRegistrationService.exe",
      "wslservice.exe",
      "IDBWMService.exe",
      "IDBWM.exe",
      "wlanext.exe",
      "gamingservices.exe",
      "gamingservicesnet.exe",
      "AggregatorHost.exe",
      "vmcompute.exe",
      "SecurityHealthService.exe",
      "unsecapp.exe",
      "openvpn.exe",
      "MpDefenderCoreService.exe",
      "MsMpEng.exe",
      "NisSrv.exe",
      "adb.exe",
      // System Host Processes (and duplicates):
      "conhost.exe",
      "taskhostw.exe",
      "WidgetService.exe",
      "LockApp.exe",
      "ipf_helper.exe",
      "TextInputHost.exe",
      "PhoneExperienceHost.exe",
      "smartscreen.exe",
      "SecurityHealthSystray.exe",
      // Other Windows & OEM/Service Processes:
      "ICPS.exe",
      "IGCCTray.exe",
      "IGCC.exe",
      "ShellExperienceHost.exe",
      "Copilot.exe",
      "ms-teams.exe",
      "CrossDeviceService.exe",
      "MicrosoftSecurityApp.exe",
      "OpenConsole.exe",
      "WindowsTerminal.exe",
      "wsl.exe",
      "vmwp.exe",
      "vmmemWSL",
      "dllhost.exe",
      "wslrelay.exe",
      "wslhost.exe",
      "AsusSoftwareManagerAgent.exe",
      // Additional Non‑User Apps:
      "BraveCrashHandler.exe",
      "BraveCrashHandler64.exe",
      "OfficeClickToRun.exe",
      "AppVShNotify.exe",
      "SearchIndexer.exe",
      "SystemSettings.exe",
      "ApplicationFrameHost.exe",
      "UserOOBEBroker.exe",
      "SDXHelper.exe",
      "msrdc.exe",
      "backgroundTaskHost.exe",
      "audiodg.exe",
      "WmiApSrv.exe",
      "SearchProtocolHost.exe",
      "Taskmgr.exe",
      "powershell.exe"
    ]);

    // Deduplicate by process name.
    const uniqueAppsMap = new Map<string, any>();

    processData.list.forEach(p => {
      // Exclude if the process name is in our system list and it’s running as a system process.
      if (systemProcessNames.has(p.name) &&
          (!p.user ||
           p.user.toUpperCase() === "SYSTEM" ||
           p.user.toLowerCase() === "root")) {
        return;
      }

      // If we haven't seen this process name before, add it.
      // If it appears multiple times, keep the instance with the highest CPU usage.
      if (!uniqueAppsMap.has(p.name)) {
        uniqueAppsMap.set(p.name, p);
      } else {
        const existing = uniqueAppsMap.get(p.name);
        if (p.cpu > existing.cpu) {
          uniqueAppsMap.set(p.name, p);
        }
      }
    });

    const uniqueApps = Array.from(uniqueAppsMap.values());

    return uniqueApps.map((p, index) => ({
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

export async function getSecurityData() {
  // Get Operating System info
  const osInfoData = await si.osInfo();
  const osInfo = `${osInfoData.distro} ${osInfoData.release}`;

  // Get network traffic stats (for the first active interface)
  const networkStatsArray = await si.networkStats();
  const networkTraffic = networkStatsArray.length > 0 
    ? `RX: ${networkStatsArray[0].rx_bytes} bytes, TX: ${networkStatsArray[0].tx_bytes} bytes`
    : 'N/A';

  // Check for common antivirus processes (this is a basic check)
  const processes = await si.processes();
  const antivirusNames = ["MsMpEng", "avast", "avg", "Kaspersky", "McAfee", "Norton"];
  const foundAV = processes.list.find(p => antivirusNames.some(name => p.name.toLowerCase().includes(name.toLowerCase())));
  const antivirusStatus = foundAV ? "Active" : "Inactive";

  // Count active ports (connections in LISTEN state)
  const connections = await si.networkConnections();
  const activePorts = connections.filter(c => c.state === 'LISTEN').length;

  // Last malware scan date and time
  // (Real malware scan data is typically not available; using placeholder)
  const lastMalwareScan = "Data not available";

  return {
    osInfo,
    networkTraffic,
    antivirusStatus,
    activePorts,
    lastMalwareScan
  };
}

export async function getOpenPortsData() {
  const connections = await si.networkConnections();
  return connections
    .filter(c => c.state === 'LISTEN')
    .map(c => ({
      protocol: c.protocol,
      localAddress: (c as any).localaddress || c.localAddress,
      localPort: (c as any).localport || c.localPort,
      remoteAddress: (c as any).peeraddress || c.peerAddress || '',
      remotePort: (c as any).peerport || c.peerPort || 0,
      state: c.state,
      pid: c.pid
    }));
}