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
}

export const envMediator: EnvironmentMediator = new EnvironmentMediator();
