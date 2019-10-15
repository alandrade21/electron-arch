import * as os from 'os';
import { app } from 'electron';

/**
 * Class to verify if the app is running in development environment.
 *
 * This is made to allow that a "production" version can be used in the same machine used to
 * development, preserving the production database and configuration files.
 *
 * To the environment be identified as development, the app must be started with the command
 * "ELECTRON_ENV=dev electron .". The best way to use this is create an script in package.json file.
 *
 * If the node environment ELECTRON_ENV variable is not set, or if it is set with a value different
 * from "dev" (lowercase only), the environment will be considered "production", and the database
 * and configuration files of a possible "production" version installed in your machine can be
 * touched and, maybe, broken.
 *
 * So, please, be careful with this and, case you have a "production" version installed, do a
 * backup before start development, just in case. ;)
 */
class EnvironmentDetector {
  private env: string | undefined;

  constructor() {
    this.env = process.env.ELECTRON_ENV;
  }

  public isDev(): boolean {
    return this.env === 'dev';
  }

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
    console.log('electron.app.getPath("home") ', app.getPath('home'));
    console.log('electron.app.getPath("appData") ', app.getPath('appData'));
    console.log('electron.app.getPath("userData") ', app.getPath('userData'));
    //console.log('configStorage.getDefaultDataPath() ', configStorage.getDefaultDataPath());
    //console.log('configStorage.getDataPath() ', configStorage.getDataPath());
  }
}

export const envDetector: EnvironmentDetector = new EnvironmentDetector();
