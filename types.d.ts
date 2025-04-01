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

export type EventPayloadMapping = {
  statistics: Statistics;
  getStaticData: StaticData;
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
    };
  }
}

export type EventPayloadMapping = {
  statistics: Statistics;
  getStaticData: StaticData;
  ChangeView: View;
  sendFrameAction: FrameWindowAction;
  getBatteryData: { history: number[]; isCharging: boolean } | null; // NEW
};


export {}; // Ensures this file is treated as a module
