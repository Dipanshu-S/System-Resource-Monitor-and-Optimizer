import { app, BrowserWindow, ipcMain, Tray } from 'electron';
import path from 'path';
import { ipcMainHandle, ipcMainOn, isDev } from './util.js';
import { getBatteryData, getRunningApps, getStaticData, pollResources, getSecurityData, getOpenPortsData } from './resourceManager.js';
import { getAssetPath, getPreloadPath } from './pathResolver.js';
import { createTray } from './tray.js';
import { createMenu } from './menu.js';

ipcMain.handle('getBatteryData', async () => {
  return await getBatteryData(); // NEW: returns battery data (or null)
});

ipcMain.handle('getRunningApps', async () => {
  return await getRunningApps();  // NEW: returns running application data
});

ipcMain.handle('getSecurityData', async () => {
  return await getSecurityData();
});

ipcMain.handle('getOpenPortsData', async () => {
  return await getOpenPortsData();
});

function createWindow() {
  const mainWindow = new BrowserWindow({
    webPreferences: {
      preload: getPreloadPath(),
    },
    frame: false,
  });

  if (isDev()) {
    mainWindow.loadURL('http://localhost:5173/');
  } else {
    mainWindow.loadFile(path.join(app.getAppPath(), '/dist-react/index.html'));
  }

  pollResources(mainWindow);

  ipcMain.handle('getStaticData', () => {
    return getStaticData();
  });

  ipcMainOn('sendFrameAction', (payload) => {
    switch (payload) {
      case 'CLOSE':
        mainWindow.close();
        break;
      case 'MAXIMIZE':
        mainWindow.maximize();
        break;
      case 'MINIMIZE':
        mainWindow.minimize();
        break;
    }
  });

  createTray(mainWindow);
  handleCloseEvents(mainWindow); 
  createMenu(mainWindow);
}

function handleCloseEvents(mainWindow: BrowserWindow) {
  let willClose = false;

  mainWindow.on('close', (e) => {
    if (willClose) {
      return;
    }
    e.preventDefault();
    mainWindow.hide();
    if (app.dock) {
      app.dock.hide();
    }
  });

  app.on('before-quit', () => {
    willClose = true;
  });

  mainWindow.on('show', () => {
    willClose = false;
  });
}

app.whenReady().then(createWindow);