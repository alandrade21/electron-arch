import { MainWindowController } from './../mainWindow/MainWindowController';
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
import { AppConfigParams } from './AppConfigParams.interface';
import { ConfigFileManager } from './../configFileManager/ConfigFileManager';
import { ConfigData } from './ConfigData.interface';
import { InvalidParameterError } from '../errors/InvalidParameterError';
import { InvalidPlatformError } from './InvalidPlatformError';
import _ from 'lodash';

/**
 * Super class, with the default init behavior.
 * 
 * Your app should provide a child class, and should, as soon as possible, after 
 * the onReady event, instantiate it and call the doConfig() method.
 * 
 * To define your child class you'll need a class representing your app's config
 * file, that is a class implementing the ConfigData interface.
 * 
 * The default init behavior is implemented in the doConfig() method. To override 
 * this default behavior, simply override doConfig(). 
 * 
 * @author alandrade21
 * @since 0.0.1, 2019 jul 02
 */
export abstract class AppConfigurator <T extends ConfigData> {

  // ConfigFileManager created for the client app specific config file.
  protected _cfm: ConfigFileManager<T> | null = null;

  /* The json object with the specific app options. This is the content of the 
   * options file. 
   */
  protected _appOptions: T | undefined;

  // Absolute path to the folder holding config files.
  protected _configFolder: string;

  // Absolute path to the folder holding data files.
  protected _dataFolder: string;

  protected appConfigParams: AppConfigParams;

  /**
   * This constructor verifies which is the user's OS, and choses the config and 
   * data folders accordingly.
   *
   * If the environment is development (app.isPackaged returns false), the config 
   * and data folders are set to the value informed in the devConfigFolderPath 
   * and devDataFolderPath parameters.
   * 
   * This is made to allow a "production" version to run in the same 
   * machine used to development, preserving the production data and 
   * configuration files.
   * 
   * As said, the environment is identified as development if app.isPackaged 
   * return false.
   *
   * If the environment is not development and the prodConfigFolderPath / 
   * prodDataFolderPath are not present (or has no data) and the OS is windows, 
   * the config folder is set to the .config directory inside the app 
   * installation folder, and the data folder is set to the .data directory 
   * inside the app installation folder.
   *
   * If the environment is not development and the prodConfigFolderPath / 
   * prodDataFolderPath are not present (or has no data) and the OS is Linux, 
   * the config folder is set to the .config/<<appName>>/ directory inside 
   * the actual OS user's home folder, and the data folder is set to the 
   * .local/share/<<appName>>/ directory inside the actual OS user's home folder.
   *
   * If the environment is not development and the prodConfigFolderPath / 
   * prodDataFolderPath are not present (or has no data) and the OS is macOS, 
   * the config and data folders are set to the 
   * "Library/Application Support/<<aapName>>/" directory inside the actual OS 
   * user's home folder.
   *
   * This information will be used by other specialized components during the
   * doConfig.
   *
   * @param appConfigParams Object with the data needed to initialize the app.
   *
   * @throws InvalidParameterError if the appConfigParams is empty, or any of the
   * following appConfigParams field are empty: appName, devConfigFolderPath, 
   * devDataFolderPath.
   * @throws InvalidPlatformError if the platform running the app were nor win32, 
   * linux or darwin.
   * @throws ConfigFileError if the configFileName is malformed.
   * 
   * @author alandrade21
   * @since 0.0.1, 2019 feb 07
   */
  constructor(appConfigParams: AppConfigParams) {

    if(!appConfigParams) {
      throw new InvalidParameterError('The appConfigParams must be informed.');
    }

    if (!appConfigParams.appName) {
      throw new InvalidParameterError('The appConfigParams.appName must be informed');
    }

    if (!appConfigParams.devConfigFolderPath) {
      throw new InvalidParameterError('The appConfigParams.devConfigFolderPath must be informed');
    }

    if (!appConfigParams.devDataFolderPath) {
      throw new InvalidParameterError('The appConfigParams.devDataFolderPath must be informed');
    }

    if (app.isPackaged) { //Prod

      if(appConfigParams.prodConfigFolderPath && 
         !_.isEmpty(appConfigParams.prodConfigFolderPath))
      {
        this._configFolder = appConfigParams.prodConfigFolderPath;
      } else {
        if (process.platform === 'win32') {      
          this._configFolder = `${process.cwd()}/.config`;
        } else if (process.platform === 'darwin' || process.platform === 'linux'){
          this._configFolder = 
            `${app.getPath('appData')}/${appConfigParams.appName}`;
        } else {
          throw new InvalidPlatformError();
        }
      }

      if(appConfigParams.prodDataFolderPath && 
        !_.isEmpty(appConfigParams.prodDataFolderPath))
      {
       this._dataFolder = appConfigParams.prodDataFolderPath;
      } else {
        if (process.platform === 'win32') {
          this._dataFolder = `${process.cwd()}/.data`;
        } else if (process.platform === 'darwin') { 
          this._dataFolder = 
            `${app.getPath('appData')}/${appConfigParams.appName}`;
        } else if (process.platform === 'linux') { 
          this._dataFolder = 
            `${app.getPath('home')}/.local/share/${appConfigParams.appName}`;
        } else {
          throw new InvalidPlatformError();
        }
      }
    } else { // Dev
      this._configFolder = appConfigParams.devConfigFolderPath;
      this._dataFolder = appConfigParams.devDataFolderPath;
    }

    this.appConfigParams = appConfigParams;
  }

  /**
   * Method to start the app configuration.
   * 
   * This class make a default config. You can complete override this default
   * behavior simply overriding this method in your child class, or you can
   * extend it, overriding this method and calling it (super()) inside your
   * method.
   * 
   * The default behavior is as follows:
   * 
   * Initializes a skeleton, hidden, main window with the only purpose to show 
   * initialization errors on pop ups. Before this point, all error were
   * outputted to the console. This is a UX step. The true main window 
   * initialization will happen later. 
   *
   * This super class execute the existence check of the config file. If it 
   * do exist, the file is read and the options object is initialized. If it 
   * does not exist, the method that creates the config file is called.
   *
   * This method should be overridden to execute specific configurations.
   *
   * @throws ConfigFileError in case of error interacting with the config file.
   * 
   * @author alandrade21
   * @since 0.0.1, 2019 feb 07
   */
  public doConfig(): void {

    MainWindowController.initialize();

    /*
     * Instantiate the ConfigFileManager
     */
    let configFileName: string = 'config';

    if (this.appConfigParams.configFileName && 
        !_.isEmpty(this.appConfigParams.configFileName)) 
    {
      configFileName = this.appConfigParams.configFileName;
    }

    this._cfm = new ConfigFileManager<T>(configFileName, this._configFolder);

    let hasFile: boolean = this._cfm.fileExist();

    if (hasFile) {
      this._appOptions = this._cfm.readFile();
    } else {
      this.createConfigFile();
    }
  }

  /**
   * The implementation of this method should initialize an options object with 
   * its initial value and write it to the disk using the ConfigFileManager 
   * instance created by this super class.
   * 
   * @since 0.0.1
   */
  protected abstract createConfigFile(configFile: T): void;

}
