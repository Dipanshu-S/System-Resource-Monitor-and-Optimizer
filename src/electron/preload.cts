import { contextBridge, ipcRenderer, IpcRendererEvent } from "electron";

const electron = require('electron');

contextBridge.exposeInMainWorld("electron", {
  subscribeStatistics: (callback: (statistics: any) => void) => {
    ipcRenderer.on("statistics", (_: IpcRendererEvent, stats: unknown) => {
      callback(stats);
    });
  },
  getStaticData: () => electron.ipcRenderer.invoke('getStaticData'),
});
