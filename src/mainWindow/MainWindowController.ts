import { app, BrowserWindow, screen } from 'electron';
import * as path from 'path';
import * as url from 'url';

import { MainWindowNotInitializedError } from './MainWindowNotInitializedError';
import { MainWindowAlreadyInitializedError } from './MainWindowAlreadyInitializedError';
import { envDetector } from './../environmentDetector/EnvironmentDetector';
import { UnexpectedError } from '../errors/UnexpectedError';

/**
 * Class to encapsulate the main window initialization process and to grant static access to the
 * main window variable across the app.
 *
 * Implementation based on https://medium.com/@davembush/typescript-and-electron-the-right-way-141c2e15e4e1.
 */
export class MainWindowController {

  private static win: BrowserWindow | null;
  private static args = process.argv.slice(1);
  private static serve: boolean = MainWindowController.args.some(val => val === '--serve');

  /**
   * Public access method to the main window.
   *
   * If the main window were not initialized, this method throw an
   * MainWindowNotInitializedError.
   */
  public static get mainWindow(): BrowserWindow {
    if (!MainWindowController.win) {
      throw new MainWindowNotInitializedError('Main window not initialized');
    }
    return MainWindowController.win;
  }

  /**
   * Initializes the main window.
   */
  private static createWindow(): void {

    const electronScreen = screen;
    const size = electronScreen.getPrimaryDisplay().workAreaSize;

    // Create the browser window.
    MainWindowController.win = new BrowserWindow({
      x: 0,
      y: 0,
      width: size.width,
      height: size.height,
      show: false
    });

    if (envDetector.isDev() && MainWindowController.serve) {
      console.log(process.cwd());
      require('electron-reload')(process.cwd(), {
        electron: require(`${process.cwd()}/node_modules/electron`)
      });
      MainWindowController.win.loadURL('http://localhost:4200');
    } else {
      console.log(process.cwd());
      MainWindowController.win.loadURL(url.format({
        pathname: path.join(process.cwd(), 'dist/index.html'),
        protocol: 'file:',
        slashes: true
      }));
    }

    if (envDetector.isDev()) {
      MainWindowController.win.webContents.openDevTools();
    }

    // Emitted when the window is closed.
    MainWindowController.win.on('closed', () => {
      // Dereference the window object, usually you would store window
      // in an array if your app supports multi windows, this is the time
      // when you should delete the corresponding element.
      this.win = null;
    });

  }

  /**
   * Method to control main window initialization.
   *
   * This methods should be called only after app.on('ready').
   */
  public static initialize(): void {

    if (MainWindowController.win) {
      throw new MainWindowAlreadyInitializedError();
    }

    try {

      MainWindowController.createWindow();

      // Quit when all windows are closed.
      app.on('window-all-closed', () => {
        // On OS X it is common for applications and their menu bar
        // to stay active until the user quits explicitly with Cmd + Q
        if (process.platform !== 'darwin') {
          app.quit();
        }
      });

      app.on('activate', () => {
        // On OS X it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (!MainWindowController.win) {
          MainWindowController.createWindow();
        }
      });
    } catch (e) {
      throw new UnexpectedError('Unexpected error during main window initialization', e);
    }
  }
}
