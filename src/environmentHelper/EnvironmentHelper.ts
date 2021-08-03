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

import * as os from 'os';
import { app } from 'electron';

/**
 * Class to help the developer to verify various aspects of the electron 
 * environment.
 * 
 * @since 0.0.1
 */
class EnvironmentHelper {
  
  /**
   * Method to print various system variables.
   */
  public printEnvironment(): void {
    console.log('dirname: ', __dirname);
    console.log(`process.cwd(): ${process.cwd()}`);
    console.log(`process.platform ${process.platform}`);
    console.log(`process.execPath ${process.execPath}`);
    if (process.mainModule) {
      console.log(`process.mainModule.filename ${process.mainModule.filename}`);
    }
    console.log(`process.env.ELECTRON_ENV ${process.env.ELECTRON_ENV}`);
    console.log('os.homedir: ', os.homedir());
    console.log('os.platform: ', os.platform());
    console.log('os.userInfo:', os.userInfo());
    console.log('electron.app.isPackaged ', app.isPackaged);
    console.log('electron.app.getPath("home") ', app.getPath('home'));
    console.log('electron.app.getPath("appData") ', app.getPath('appData'));
    console.log('electron.app.getPath("userData") ', app.getPath('userData'));
    console.log('electron.app.getAppPath() ', app.getAppPath());
    console.log('electron.app.getName() ', app.getName());
    console.log('electron.app.getVersion() ', app.getVersion());
    console.log('electron.app.getLocale() ', app.getLocale());
    console.log('electron.app.getLocaleCountryCode() ', app.getLocaleCountryCode());
  }
}

export const envHelper: EnvironmentHelper = new EnvironmentHelper();
