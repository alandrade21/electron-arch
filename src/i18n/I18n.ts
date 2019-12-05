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

import * as path from 'path';
import * as _ from 'lodash';

import { InitOptions } from './InitOptions';
import { InvalidParameterError } from '../errors/InvalidParameterError';
import { I18nError } from './I18nError';

class I18n {

  private _initialized: boolean = false;

  private _options: InitOptions;

  public init(options: InitOptions): void {

    this.validateInitOptions(options);

    this._options = options;

    this._options.loadPath = path.normalize(this._options.loadPath);
  }

  /**
   * Validate the values of the initialization object. In case of any error, throw an error object.
   *
   * @param options Initialization object to be validated.
   *
   * @throws InvalidParameterError in caso of no initialization object passed.
   * @throws I18nError in case of validation error.
   */
  private validateInitOptions(options: InitOptions): void {

    if(!options) {
      throw new InvalidParameterError('The options object must be informed');
    }

    if (_.isEmpty(options.lng)) {
      throw new I18nError('The options object lng property cannot be empty.', undefined, 'INIT_OBJECT_ERROR');
    }

    if (_.isEmpty(options.fallbackLng)) {
      throw new I18nError('The options object fallbackLng property cannot be empty.', undefined, 'INIT_OBJECT_ERROR');
    }

    if (_.isEmpty(options.loadPath)) {
      throw new I18nError('The options object loadPath property cannot be empty.', undefined, 'INIT_OBJECT_ERROR');
    }

    if (!path.isAbsolute(options.loadPath)) {
      throw new I18nError('The loadPath should be an absolute directory', undefined, 'INIT_OBJECT_ERROR');
    }
  }

  get isInitialized(): boolean {
    return this._initialized;
  }
}
