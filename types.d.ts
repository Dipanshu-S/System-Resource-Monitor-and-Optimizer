// types.d.ts
export type Statistics = {
  cpuUsage: number;
  ramUsage: number;
  storageUsage: number;
};

export type StaticData = {
  totalStorage: number;
  cpuModel: string;
  totalMemoryGB: number;
};

export type View = 'CPU' | 'RAM' | 'STORAGE';
export type FrameWindowAction = 'CLOSE' | 'MAXIMIZE' | 'MINIMIZE'; 

export type SecurityData = {
  osInfo: string;
  networkTraffic: string;
  antivirusStatus: string;
  activePorts: number;
  lastMalwareScan: string;
};

export type PortData = {
  protocol: string;
  localAddress: string;
  localPort: number;
  remoteAddress: string;
  remotePort: number;
  state: string;
  pid: number;
};

export type EventPayloadMapping = {
  statistics: Statistics;
  getStaticData: StaticData;
  getSecurityData: SecurityData;
  ChangeView: View;
  sendFrameAction: FrameWindowAction;
  getBatteryData: { history: number[]; isCharging: boolean } | null;
  getRunningApps: {
    srNo: number;
    appName: string;
    currentCpuUsage: number;
    memoryConsumption: number;
    permissionsAllowed: string;
  }[];
  getOpenPortsData: PortData[];
};

export type UnsubscribeFunction = () => void;

declare global {
  interface Window {
    electron: {
      subscribeStatistics: (
        callback: (statistics: Statistics) => void
      ) => UnsubscribeFunction;
      subscribeChangeView: (
        callback: (view: View) => void
      ) => UnsubscribeFunction;
      sendFrameAction: (payload: FrameWindowAction) => void;
      getStaticData: () => Promise<StaticData>;
      getBatteryData: () => Promise<{ history: number[]; isCharging: boolean } | null>;
      getRunningApps: () => Promise<{
        srNo: number;
        appName: string;
        currentCpuUsage: number;
        memoryConsumption: number;
        permissionsAllowed: string;
      }[]>;
      getSecurityData: () => Promise<SecurityData>;
      getOpenPortsData: () => Promise<PortData[]>;
    };
  }
}

export {}; // Ensures this file is treated as a module
