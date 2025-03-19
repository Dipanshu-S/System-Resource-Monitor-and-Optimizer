import { ipcMain, WebContents, WebFrameMain } from 'electron';
import { EventPayloadMapping } from '../../types.js';
// Remove the .js extension so TypeScript can resolve the correct file.
import { getPreloadPath, getUIPath } from './pathResolver.js';
import { pathToFileURL } from 'url';
/// <reference path="../../types.d.ts" />


export function isDev(): boolean {
  return process.env.NODE_ENV === 'development';
}

export function ipcMainHandle<Key extends keyof EventPayloadMapping>(
  key: Key,
  handler: () => EventPayloadMapping[Key]
) {
  ipcMain.handle(key, (event) => {
    const frame = event.senderFrame;
    if (!frame) {
      throw new Error('No sender frame found');
    }
    validateEventFrame(event.senderFrame);
    return handler();
  });
}

export function ipcMainOn<Key extends keyof EventPayloadMapping>(
  key: Key,
  handler: (payload: EventPayloadMapping[Key]) => void
) {
  ipcMain.on(key, (event, payload) => {
    const frame = event.senderFrame;
    if (!frame) {
      throw new Error('No sender frame found');
    }
    validateEventFrame(frame);
    return handler(payload);
  });
}

export function ipcWebContentsSend<Key extends keyof EventPayloadMapping>(
  key: Key,
  webContents: WebContents,
  payload: EventPayloadMapping[Key]
) {
  webContents.send(key, payload);
}

export function validateEventFrame(frame: WebFrameMain) {
  console.log(frame.url);
  if (isDev() && new URL(frame.url).host === 'localhost:5173') {
    return;
  }
  if (frame.url !== pathToFileURL(getUIPath()).toString()) {
    throw new Error('Malicious event');
  }
}

