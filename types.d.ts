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

export type EventPayloadMapping = {
  statistics: Statistics;
  getStaticData: StaticData;
};

export type UnsubscribeFunction = () => void;

declare global {
  interface Window {
    electron: {
      subscribeStatistics: (callback: (statistics: Statistics) => void
    ) => UnsubscribeFunction;
      getStaticData: () => Promise<StaticData>;
    };
  }
}

export {}; // Ensures this file is treated as a module
