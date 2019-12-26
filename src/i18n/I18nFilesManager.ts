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

import * as _ from 'lodash';
import * as path from 'path';
import * as fs from 'fs';
import * as mkdirp from 'mkdirp';

import { InvalidParameterError } from '../errors/InvalidParameterError';
import { I18nError } from './I18nError';

export class I18nFilesManager {
  private _dataDir: string;

  /**
   * This constructor uses the rules implemented on the setter method to set the received value.
   *
   * @param dataDir The path to the app data directory. This must be an absolute path.
   */
  constructor(dataDir: string){
    this.setDataDir(dataDir);
  }

  /**
   * The dataDir cannot be empty nor a relative path.
   *
   * @throws InvalidParameterError if the dataDir is empty.
   * @throws I18nError if the dataDir is not an absolute path.
   */
  private setDataDir(dataDir: string): void {
    if (_.isEmpty(dataDir)) {
      throw new InvalidParameterError('The dataDir cannot be empty.');
    }

    if (!path.isAbsolute(dataDir)) {
      throw new I18nError('The dataDir should be an absolute path to a directory.');
    }

    this._dataDir = path.normalize(dataDir);
  }
}
