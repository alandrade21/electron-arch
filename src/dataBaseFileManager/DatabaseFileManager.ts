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
 * along with "electron-arch". If not, see <https://www.gnu.org/licenses/>.
 */

// import { app } from 'electron';
import * as _ from 'lodash';
import * as path from 'path';
import * as fs from 'fs';
import * as mkdirp from 'mkdirp';

import { InvalidParameterError } from '../errors/InvalidParameterError';
import { DatabaseFileError } from './DatabaseFileError';

export class DatabaseFileManager {
  
  private _fileName!: string;
  private _filePath!: string;

  /**
   * This constructor uses the rules implemented on the setter methods to set the received values.
   *
   * @param fileName The name of the database file, preferably with no extension. The .sqlite
   * extension will be used.
   * @param filePath The path to the database file. This must be an absolute path.
   *
   * @throws InvalidParameterError if the fileName or filePath is empty.
   * @throws ConfigFileError if the fileName is malformed or the filePath is not an absolute path.
   */
  constructor(
    fileName: string,
    filePath: string
  ){
    this.setFileName(fileName);
    this.setFilePath(filePath);
  } 

  /**
   * Verifies if the database file identified by _filePath/_fileName exists on disk.
   *
   * @throws DatabaseFileError in case of any error different from ENOENT.
   */
  public fileExist(): boolean {
    try {
      fs.accessSync(path.join(this.filePath, this.fileName), fs.constants.F_OK);
      return true;
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        return false;
      }
      const msg = `An error occurred verifying the database file ${path.join(this.filePath, this.fileName)} existence.`;

      if (error.code === 'EPERM') {
        throw new DatabaseFileError(`${msg} There was a permission problem.`, error, 'EPERM');
      }
      throw new DatabaseFileError(`${msg} Unexpected problem.`, error, (error.code ? error.code : null));
    }
  }

  /**
   * Verifies if the skeleton database file exists on disk.
   * 
   * @param skelFilePath Absolute path to the skeleton database file.
   * @param skelFileName Name of the skeleton database file.
   *
   * @throws DatabaseFileError in case of any error different from ENOENT.
   */
  private skelFileExist(skelFilePath: string, skelFileName: string): boolean {
    try {
      fs.accessSync(path.join(skelFilePath, skelFileName), fs.constants.F_OK);
      return true;
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        return false;
      }
      const msg = `An error occurred verifying the skeleton database file ${path.join(skelFilePath, skelFileName)} existence.`;

      if (error.code === 'EPERM') {
        throw new DatabaseFileError(`${msg} There was a permission problem.`, error, 'EPERM');
      }
      throw new DatabaseFileError(`${msg} Unexpected problem.`, error, (error.code ? error.code : null));
    }
  }

  /**
   * Copies and renames an skeleton sqlite database file to the location where the app database 
   * must be placed.
   * 
   * An skeleton database file is a database file containing only the database structure and 
   * base data. In other words, its a pristine database, without any user data.
   * 
   * The location and the new name where this skeleton database file will be copied was defined 
   * by this class constructor.
   * 
   * @param skelFileName Name of the skeleton database file.
   * @param skelFilePath Absolute path to the skeleton database file.
   * 
   * @throws InvalidParameterError if the skelFilePath or skelFileName is empty.
   * @throws DatabaseFileError if the skelFilePath is not an absolute path, if the user database 
   * file already existis, if the skeleton database file does not exists and if an error occurred 
   * during the copy.
   */
  public copySkellDatabase(skelFileName: string, skelFilePath: string): void {

    if (_.isEmpty(skelFilePath)) {
      throw new InvalidParameterError('The path to the skeleton database file cannot be empty.');
    }

    if (_.isEmpty(skelFileName)) {
      throw new InvalidParameterError('The skeleton database file name cannot be empty.');
    }

    if (!path.isAbsolute(skelFilePath)) {
      throw new DatabaseFileError('The path to the skeleton database file should be an absolute directory.');
    }

    if (this.fileExist()) {
      throw new DatabaseFileError('The user database file already exists.');
    }

    if (!this.skelFileExist(skelFilePath, skelFileName)){
      throw new DatabaseFileError(`The skeleton database file ${skelFileName} was not found on the path ${skelFilePath}.`, 
        null, 'ENOENT');
    }

    // Create the directory in case it doesn't exist yet
    try {
      mkdirp.sync(this.filePath);
    } catch (error: any) {
      throw new DatabaseFileError(`It was not possible to create the directory ${this.filePath} for the database file.`, error, (error.code ? error.code : null));
    }

    try {
      fs.copyFileSync(path.join(skelFilePath, skelFileName), 
                      path.join(this.filePath, this.fileName), fs.constants.COPYFILE_EXCL);
    } catch (error: any) {
      throw new DatabaseFileError(`An error occurred copying the skeleton database from ${path.join(skelFilePath, skelFileName)} to ${path.join(this.filePath, this.fileName)}.`, 
        error, (error.code ? error.code : null));
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
   * The database file, when created, will have the .sqlite extension. If the fileName is 
   * provided with a .sqlite extension, the file will not be created as .sqlite.sqlite. But if 
   * another extension is provided, like .txt, the file will be created as .txt.sqlite.
   *
   * @throws InvalidParameterError if the filename is empty.
   * @throws DatabaseFileError if the filename is malformed.
   */
  private setFileName(fileName: string): void {
    if (_.isEmpty(fileName)) {
      throw new InvalidParameterError('The fileName cannot be empty.');
    }

    // Trick to prevent adding the `.sqlite` twice
    // if the filename already contains it.
    const fileWithNoExt = path.basename(fileName, '.sqlite');

    // If after removing the extension the filename is empty.
    if (_.isEmpty(fileWithNoExt)) {
      throw new DatabaseFileError('The fileName was not corrected formed.');
    }

    // Prevent ENOENT and other similar errors when using
    // reserved characters in Windows filenames.
    // See: https://en.wikipedia.org/wiki/Filename#Reserved%5Fcharacters%5Fand%5Fwords
    this._fileName = encodeURIComponent(`${fileWithNoExt}.sqlite`)
      .replace(/\*/g, '-').replace(/%20/g, ' ');
  }

  get filePath() {
    return this._filePath;
  }

  /**
   * The filePath cannot be empty nor a relative path.
   *
   * @throws InvalidParameterError if the filePath is empty.
   * @throws DatabaseFileError if the filePath is not an absolute path.
   */
  private setFilePath(filePath: string): void {
    if (_.isEmpty(filePath)) {
      throw new InvalidParameterError('The filePath cannot be empty.');
    }

    if (!path.isAbsolute(filePath)) {
      throw new DatabaseFileError('The filePath should be an absolute directory');
    }

    this._filePath = path.normalize(filePath);
  }
}
