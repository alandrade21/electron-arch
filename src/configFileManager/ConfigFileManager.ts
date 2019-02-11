import { ConfigFileError } from './ConfigFileError';
import { app } from 'electron';
import * as _ from 'lodash';
import * as path from 'path';
import * as fs from 'fs';

import { ConfigData } from '../appConfigurator/ConfigData';

/**
 * This class is responsible to manipulate a config file.
 * 
 * It was created based on the work of Juan Cruz Viotti on electron-json-storage project 
 * (https://github.com/electron-userland/electron-json-storage).
 */
export class ConfigFileManager<T extends ConfigData> {

  private _fileName: string;
  private _filePath: string;

  /**
   * This constructor uses the rules implemented on the setter methods to set the received values.
   * 
   * @param fileName The name of the config file, preferably with no extension. The .json 
   * extension will be used. The file name cannot start with a dot. If omited, the default file
   * name config.json will be used.
   * @param filePath The path to the config file. This must be an absolute path. If omited, the
   * default path will be app.getPath('userData').
   */
  constructor(
    fileName: string = 'config',
    filePath: string = app.getPath('userData')
  ){
    this.fileName = fileName;
    this.filePath = filePath;
  }

  /**
   * Verifies if the config file identified by _filePath/_fileName exists on disk.
   */
  public fileExist(): boolean {
    try {
      fs.accessSync(path.join(this.filePath, this.fileName), fs.constants.F_OK);
      return true;
    } catch (error) {
      return false;
    }
  }

  public readFile(): T | ConfigFileError {
    let rawData: string;
    try {
      rawData = fs.readFileSync(path.join(this.filePath, this.fileName), {encoding: 'utf8'});
    } catch (error) {
      const msg = `An error occurred reading the configuration file ${path.join(this.filePath, this.fileName)}.`;
      console.log(msg, error);
      if (error.code === 'ENOENT') {
        return new ConfigFileError(`${msg} The config file does not exist.`, error);
      } else if (error.code === 'EPERM') {
        return new ConfigFileError(`${msg} There was a permission problem.`, error);
      } else {
        return new ConfigFileError(`${msg} Unexpected problem.`, error);
      }
    }

    let data: T;
    try {
      data = JSON.parse(rawData);
    } catch (error) {
      return new ConfigFileError(`Unexpected problem.`, error);
    }

    return data;
  }

  get fileName() {
    return this._fileName;
  }

  /**
   * The parameter fileName cannot be empty, or cannot have only an extension (or a filename 
   * started by a dot).
   * 
   * The fileName will be encoded as a URI, to avoid problems with the file system.
   * 
   * The config file, when created, will have the .json extension. If the fileName is provided with
   * a .json extension, the file will not be created as .json.json. But if another extension is 
   * provided, like .txt, the file will be created as .txt.json.
   */
  set fileName(fileName: string) {
    if (_.isEmpty(fileName)) {
      throw new Error('The fileName cannot be empty.');
    }

    // Trick to prevent adding the `.json` twice
    // if the filename already contains it.
    const fileWithNoExt = path.basename(fileName, '.json');

    // If after removing the extension the filename is empty.
    if (_.isEmpty(fileWithNoExt)) {
      throw new Error('The fileName was not corrected formed.');
    }

    // Prevent ENOENT and other similar errors when using
    // reserved characters in Windows filenames.
    // See: https://en.wikipedia.org/wiki/Filename#Reserved%5Fcharacters%5Fand%5Fwords
    this._fileName = encodeURIComponent(`${fileWithNoExt}.json`)
      .replace(/\*/g, '-').replace(/%20/g, ' ');
  }

  get filePath() {
    return this._filePath;
  }

  /**
   * The filePath cannot be empty nor a relative path.
   */
  set filePath(filePath: string) {
    if (_.isEmpty(filePath)) {
      throw new Error('The filePath cannot be empty.');
    }

    if (!path.isAbsolute(filePath)) {
      throw new Error('The filePath should be an absolute directory');
    }

    this._filePath = path.normalize(filePath);
  }
}
