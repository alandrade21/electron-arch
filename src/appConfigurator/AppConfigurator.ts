import { ConfigData } from './ConfigData';
import { ConfiguratorError } from './ConfiguratorError';
import { envDetector } from '../environmentDetector/EnvironmentDetector';
import { app } from 'electron';
import * as configStorage from 'electron-json-storage';

export abstract class AppConfigurator {

  /**
   * Identifies the folder to be used as configuration folder, to verify and create configuration files.
   */
  protected _configFolder: string;

  /**
   * Name to be used as file name on the config file. It also is used as key to the
   * electron-json-storage api. It is initialized by the constructor.
   */
  protected configFileName: string;

  /**
   * Verifies which is the user's OS, and detects the user's home folder accordingly.
   *
   * If the evironment is development, the home user folder is set to the value informed in the 
   * devConfigFolderPath parameter.
   *
   * If the environment is not development and the OS is windows, the config folder is set to the
   * folder .config inside the folder in which the app is installed.
   *
   * If the environment is not development and the OS is not windows (i.e. linux like OS), the config
   * folder is set to the folder .config/<<appName>>/ inside the actual OS user's home folder.
   * 
   * @param appName Name of the app being configured. This name will be used to create a folder 
   * structure to host the configuration file.
   * 
   * @param devConfigFolderPath Absolute path to the development data folder structure. This structure 
   * is a copy of the system folders that will be used during production. For more info, see 
   * https://github.com/alandrade21/devTestFolders.
   * 
   * @param configFileName Name of the configuration file to be used. This file will have the .json 
   * extension.
   */
  constructor(appName: string, devConfigFolderPath: string, configFileName = 'config') {

    this.configFileName = configFileName;

    if (!envDetector.isDev()) {
      if (process.platform === 'win32') {
        this._configFolder = `${process.cwd()}/.config`;
      } else {
        this._configFolder = `${app.getPath('appData')}/${appName}`;
      }
    } else {
      this._configFolder = devConfigFolderPath;
    }

    configStorage.setDataPath(this.configFolder);
  }

  public doConfig(): void | ConfiguratorError {
    configStorage.has(this.configFileName, (error: any, hasKey: boolean) => {
      if (error) {
        let msg = 'An error occurred when verifying the config file existance.';

        if (error instanceof Error) {
          msg += ' Original message: ' + error.message;
        }

        console.log(msg, error);
        
        return new ConfiguratorError(msg, error);
      }

      if (hasKey) {
        this.readConfigFile();
      } else {
        this.createConfigFile();
      }
    });
  }

  protected readConfigFile(): ConfigData | ConfiguratorError {

  }

  protected createConfigFile(): void {

  }

  get configFolder(): string {
    return this._configFolder;
  }

}

