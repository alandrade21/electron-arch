/*
 * Copyright (c) 2022 André Andrade - alandrade21@gmail.com
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

import { app } from 'electron';

import { ConfigFileManager } from './../configFileManager/ConfigFileManager';
import { ConfigData } from './ConfigData';
import { InvalidParameterError } from '../errors/InvalidParameterError';
import { InvalidPlatformError } from './InvalidPlatformError';

/**
 * Super class, with basic functionalities, for app configuration classes.
 * 
 * @since 0.0.1
 */
export abstract class AppConfigurator <T extends ConfigData> {

  // ConfigFileManager created for the client app specific config file.
  protected _cfm: ConfigFileManager<T>;

  /* The json object with the specific app options. This is the content of the 
   * options file. 
   */
  protected _appOptions: T | undefined;

  // Absolute path to the folder holding config files.
  protected _configFolder: string;

  // Absolute path to the folder holding data files.
  protected _dataFolder: string;

  /**
   * This constructor verifies which is the user's OS, and choses the config and 
   * data folders accordingly.
   *
   * If the environment is development (app.isPackaged returns false), the config 
   * and data folders are set to the value informed in the devConfigFolderPath 
   * and devDataFolderPath parameters.
   * 
   * This is made to allow a "production" version to run in the same 
   * machine used to development, preserving the production database and 
   * configuration files.
   * 
   * As said, the environment is identified as development if app.isPackaged 
   * return false.
   *
   * If the environment is not development and the OS is windows, the config 
   * folder is set to the .config directory inside the app installation folder, 
   * and the data folder is set to the .data directory inside the app installation 
   * folder.
   *
   * If the environment is not development and the OS is Linux, the config
   * folder is set to the .config/<<appName>>/ directory inside the actual OS 
   * user's home folder, and the data folder is set to the 
   * .local/share/<<appName>>/ directory inside the actual OS user's home folder.
   *
   * If the environment is not development and the OS is macOS, the config and 
   * data folders are set to the "Library/Application Support/<<aapName>>/" 
   * directory inside the actual OS user's home folder.
   *
   * This constructor uses this information to configure a ConfigFileManager.
   *
   * @param appName Name of the app being configured. This name will be used to 
   * create a folder structure to host the configuration file.
   *
   * @param devConfigFolderPath Absolute path to the development data folder 
   * structure. This structure is a copy of the system folders that will be used 
   * during production. For more info, see 
   * https://github.com/alandrade21/devTestFolders.
   *
   * @param devDataFolderPath Absolute path to the development data folder 
   * structure. This structure is a copy of the system folders that will be used 
   * during production. For more info, see
   * https://github.com/alandrade21/devTestFolders.
   *
   * @param configFileName Name of the configuration file to be used. This file 
   * will have the .json extension.
   *
   * @throws InvalidParameterError if the appName, devConfigFolderPath or 
   * devDataFolderPath is empty.
   * @throws InvalidPlatformError if the platform running the app were nor win32, 
   * linux or darwin.
   * @throws ConfigFileError if the configFileName is malformed.
   * 
   * @since 0.0.1
   */
  constructor(appName: string, 
              devConfigFolderPath: string, 
              devDataFolderPath: string,
              configFileName: string = 'config') {

    if (!appName) {
      throw new InvalidParameterError('The appName parameter must be informed');
    }

    if (!devConfigFolderPath) {
      throw new InvalidParameterError('The devConfigFolderPath parameter must be informed');
    }

    if (!devDataFolderPath) {
      throw new InvalidParameterError('The devDataFolderPath parameter must be informed');
    }

    if (app.isPackaged) {
      if (process.platform === 'win32') {
        this._configFolder = `${process.cwd()}/.config`;
        this._dataFolder = `${process.cwd()}/.data`;
      } else if (process.platform === 'darwin' || process.platform === 'linux'){
        this._configFolder = `${app.getPath('appData')}/${appName}`;

        if (process.platform === 'darwin') { // mac os
          this._dataFolder = `${app.getPath('appData')}/${appName}`;
        } else { // linux
          this._dataFolder = `${app.getPath('home')}/.local/share/${appName}`;
        }
      } else {
        throw new InvalidPlatformError();
      }
    } else {
      this._configFolder = devConfigFolderPath;
      this._dataFolder = devDataFolderPath;
    }

    this._cfm = new ConfigFileManager<T>(configFileName, this._configFolder);
  }

  /**
   * Method to start the app configuration.
   *
   * This super class execute the existence check of the config file. If it 
   * do exist, the file is read and the options object is initialized. If it 
   * does not exist, the method that creates the config file is called.
   *
   * This method should be overridden to execute specific configurations.
   *
   * @throws ConfigFileError in case of error interacting with the config file.
   * 
   * @since 0.0.1
   */
  public doConfig(): void {

    let hasFile: boolean = this._cfm.fileExist();

    if (hasFile) {
      this.readConfigFile();
    } else {
      this.createConfigFile();
    }
  }

  /**
   * Reads the config file.
   *
   * @throws ConfigFileError in case of error interacting with the config file.
   * 
   * @since 0.0.1
   */
  private readConfigFile(): void {
    this._appOptions = this._cfm.readFile();
  }

  /**
   * The implementation of this method should initialize an options object with 
   * its initial value and write it to the disk using the ConfigFileManager 
   * instance created by this super class.
   * 
   * @since 0.0.1
   */
  protected abstract createConfigFile(): void;

}
