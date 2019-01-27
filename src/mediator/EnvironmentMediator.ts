import * as os from 'os';

/**
 * Class to verify if the app is runnin in development environment.
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
 * So, please, be carefull with this and, case you have a "production" version installed, do a
 * backup before start development, just in case. ;)
 */
class EnvironmentMediator {
  private env: string | undefined;

  constructor() {
    this.env = process.env.ELECTRON_ENV;
  }

  public isDev(): boolean {
    return this.env === 'dev';
  }

  public printEnvironment(): void {
    console.log('dirname:', __dirname);
    console.log(`Current directory: ${process.cwd()}`);
    console.log(`This platform is ${process.platform}`);
    console.log(`Exec path is ${process.execPath}`);
    if (process.mainModule) {
      console.log(`Main module file is ${process.mainModule.filename}`);
    }
    console.log(`ELECTRON_DEV is ${process.env.ELECTRON_ENV}`);
    console.log('os homedir:', os.homedir());
    console.log('os platform:', os.platform());
    console.log('os userinfo:', os.userInfo());
  }
}

export const envMediator: EnvironmentMediator = new EnvironmentMediator();
