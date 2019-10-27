/*
 * Copyright (c) 2019 André Andrade - alandrade21@gmail.com
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
 * along with "server-arch".  If not, see <https://www.gnu.org/licenses/>.
 */

import { app } from 'electron';
import * as _ from 'lodash';
import * as path from 'path';
import * as fs from 'fs';
import * as mkdirp from 'mkdirp';

import { ConfigData } from '../appConfigurator/ConfigData';
import { InvalidParameterError } from './../errors/InvalidParameterError';
import { ConfigFileError } from './ConfigFileError';

/**
 * This class is responsible to manipulate a config file. This class should be instantiated
 * identifying the concrete implementation of the config data.
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
   * extension will be used. If omitted, the default file name config.json will be used.
   * @param filePath The path to the config file. This must be an absolute path. If omitted, the
   * default path will be app.getPath('userData').
   *
   * @throws InvalidParameterError if the fileName or filePath is empty.
   * @throws ConfigFileError if the fileName is malformed or the filePath is not an absolute path.
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
   *
   * @throws ConfigFileError in case of any error different from ENOENT.
   */
  public fileExist(): boolean {
    try {
      fs.accessSync(path.join(this.filePath, this.fileName), fs.constants.F_OK);
      return true;
    } catch (error) {
      if (error.code === 'ENOENT') {
        return false;
      }
      const msg = `An error occurred verifying the configuration file ${path.join(this.filePath, this.fileName)} existence.`;

      if (error.code === 'EPERM') {
        throw new ConfigFileError(`${msg} There was a permission problem.`, error, 'EPERM');
      }
      throw new ConfigFileError(`${msg} Unexpected problem.`, error, (error.code ? error.code : null));
    }
  }

  /**
   * Reads the configuration file and returns an object of the concrete type representing the configuration
   * options.
   *
   * @throws ConfigFileError if the is any problem reading the file.
   */
  public readFile(): T {
    let rawData: string;
    try {
      rawData = fs.readFileSync(path.join(this.filePath, this.fileName), {encoding: 'utf8'});
    } catch (error) {
      const msg = `An error occurred reading the configuration file ${path.join(this.filePath, this.fileName)}.`;

      if (error.code === 'ENOENT') {
        throw new ConfigFileError(`${msg} The config file does not exist.`, error, error.code);
      } else if (error.code === 'EPERM') {
        throw new ConfigFileError(`${msg} There was a permission problem.`, error, error.code);
      } else {
        throw new ConfigFileError(`${msg} Unexpected problem.`, error, (error.code ? error.code : null));
      }
    }

    let data: T;
    try {
      data = JSON.parse(rawData);
    } catch (error) {

      // TODO implement a method to recreate the config file via initialization parameter.
      throw new ConfigFileError(`It was not possible to read the configuration file ${path.join(this.filePath, this.fileName)}. It could be corrupted.`, error, 'PARSE_ERROR');
    }

    return data;
  }

  /**
   * Writes the config file to the disk, replacing its contents if it exists.
   *
   * If the directory does not exists, create it.
   *
   * @param data The data to be written to the file.
   *
   * @throws InvalidParameterError if the data was not informed.
   * @throws ConfigFileError In case of file system errors.
   */
  public writeFile(data: T): void {
    if (_.isEmpty(data)) {
      const msg = 'The data parameter must be informed.';
      const trace = new Error(msg);
      const error = new InvalidParameterError(msg, trace);
      throw error;
    }

    const jsonData = JSON.stringify(data);

    // Create the directory in case it doesn't exist yet
    try {
      mkdirp.sync(this.filePath);
    } catch (error) {
      throw new ConfigFileError(`It was not possible to create the directory ${this.filePath} for the config file.`, error, (error.code ? error.code : null));
    }

    // Write the file
    try {
      fs.writeFileSync(path.join(this.filePath, this.fileName), jsonData, {encoding: 'utf8'});
    } catch (error) {
      const msg = `An error occurred writing the configuration file ${path.join(this.filePath, this.fileName)}.`;

      if (error.code === 'EPERM') {
        throw new ConfigFileError(`${msg} There was a permission problem.`, error, error.code);
      } else {
        throw new ConfigFileError(`${msg} Unexpected problem.`, error, (error.code ? error.code : null));
      }
    }
  }

  //////////////////////////////////////////

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
   *
   * @throws InvalidParameterError if the filename is empty.
   * @throws ConfigFileError if the filename is malformed.
   */
  set fileName(fileName: string) {
    if (_.isEmpty(fileName)) {
      throw new InvalidParameterError('The fileName cannot be empty.');
    }

    // Trick to prevent adding the `.json` twice
    // if the filename already contains it.
    const fileWithNoExt = path.basename(fileName, '.json');

    // If after removing the extension the filename is empty.
    if (_.isEmpty(fileWithNoExt)) {
      throw new ConfigFileError('The fileName was not corrected formed.');
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
   *
   * @throws InvalidParameterError if the filePath is empty.
   * @throws ConfigFileError if the filePath is not an absolute path.
   */
  set filePath(filePath: string) {
    if (_.isEmpty(filePath)) {
      throw new InvalidParameterError('The filePath cannot be empty.');
    }

    if (!path.isAbsolute(filePath)) {
      throw new ConfigFileError('The filePath should be an absolute directory');
    }

    this._filePath = path.normalize(filePath);
  }
}
