import { InvalidParameterError } from './../errors/InvalidParameterError';
/*
 * Copyright (c) 2021 André Andrade - alandrade21@gmail.com
 * 
 * This file is part of the "electron-arch" library.
 *
 * "electron-arch" is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * any later version.
 *
 * "electron-arch" is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with "electron-arch".  If not, see <https://www.gnu.org/licenses/>.
 */

import { app, BrowserWindow/*, screen*/ } from 'electron';
import * as path from 'path';
import * as url from 'url';

import { MainWindowNotInitializedError } from './MainWindowNotInitializedError';
import { MainWindowAlreadyInitializedError } from './MainWindowAlreadyInitializedError';
import { UnexpectedError } from '../errors/UnexpectedError';
import { AppNotReadyError } from './../errors/AppNotReadyError';
import { MainWindowPosition } from './MainWindowPosition';

/**
 * Class to encapsulate the main window initialization process and to grant 
 * static access to the main window variable across the app.
 *
 * Implementation based on 
 * https://medium.com/@davembush/typescript-and-electron-the-right-way-141c2e15e4e1.
 * 
 * @since 0.0.1
 */
export class MainWindowController {

  private static _mainWindow: BrowserWindow | null;
  private static args = process.argv.slice(1);
  private static serve: boolean = 
    MainWindowController.args.some(val => val === '--serve');

  /**
   * Public static access method to the main window.
   *
   * @throws MainWindowNotInitializedError If the main window were not 
   * initialized.
   * 
   * @since 0.0.1
   */
  public static get mainWindow(): BrowserWindow {
    if (!MainWindowController._mainWindow) {
      throw new MainWindowNotInitializedError();
    }
    return MainWindowController._mainWindow;
  }

  /**
   * Initializes the main window.
   * 
   * @param pos Object containing the position and size of the new window.
   * 
   * @throws InvalidParameterError if the pos parameter is null.
   * 
   * @since 0.0.1
   */
  private static createWindow(pos: MainWindowPosition): void {

    if (!pos) {
      throw new InvalidParameterError('The pos parameter must be informed.');
    }

    console.log(`Creating the browser window with the coordinates x:${pos.x}, y:${pos.y}, width:${pos.width}, height:${pos.height}.`);

    // Create the browser window.
    MainWindowController._mainWindow = new BrowserWindow({
      x: pos.x,
      y: pos.y,
      width: pos.width,
      height: pos.height,
      webPreferences: {
        nodeIntegration: true,
      },
      show: false
    });

    if (!app.isPackaged) {
      //console.log(process.cwd());
      require('electron-reload')(process.cwd(), {
        electron: require(`${process.cwd()}/node_modules/electron`)
      });

      if (MainWindowController.serve) {
        MainWindowController.mainWindow.loadURL('http://localhost:4200');
      } else {
        // TODO testar
        MainWindowController.mainWindow.loadURL(url.format({
          pathname: path.join(process.cwd(), 'dist/index.html'),
          protocol: 'file:',
          slashes: true
        }));
      }

      MainWindowController.mainWindow.webContents.openDevTools();
    } else {
      console.log(process.cwd());
      MainWindowController.mainWindow.loadURL(url.format({
        pathname: path.join(process.cwd(), 'dist/index.html'),
        protocol: 'file:',
        slashes: true
      }));
    }

    // Emitted when the window is closed.
    MainWindowController._mainWindow.on('closed', () => {
      // Dereference the window object, usually you would store window
      // in an array if your app supports multi windows, this is the time
      // when you should delete the corresponding element.
      this._mainWindow = null;
    });
  }

  /**
   * Method to control main window initialization.
   *
   * This methods should be called only after app.on('ready').
   */
  public static initialize(pos: MainWindowPosition): void {

    console.log('Initializing main window.');

    if (!app.isReady()) {
      throw new AppNotReadyError();
    }

    if (MainWindowController._mainWindow) {
      throw new MainWindowAlreadyInitializedError();
    }

    try {

      MainWindowController.createWindow(pos);

      // Quit when all windows are closed.
      app.on('window-all-closed', () => {
        // On OS X it is common for applications and their menu bar
        // to stay active until the user quits explicitly with Cmd + Q
        if (process.platform !== 'darwin') {
          app.quit();
        }
      });

      // TODO testar como OSX se comporta sem isso.
      // TODO mover isso para o cliente?
      // app.on('activate', () => {
      //   // On OS X it's common to re-create a window in the app when the
      //   // dock icon is clicked and there are no other windows open.
      //   if (!MainWindowController._mainWindow) {
      //     MainWindowController.createWindow();
      //   }
      // });
    } catch (e) {
      throw new UnexpectedError(
        'Unexpected error during main window initialization', e);
    }
  }
}
