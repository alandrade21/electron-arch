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
import * as fs from 'fs';

import { InitOptions } from './InitOptions';
import { InvalidParameterError } from '../errors/InvalidParameterError';
import { I18nError } from './I18nError';
import { runInNewContext } from 'vm';

class I18n {

  private _initialized: boolean = false;

  private _options: InitOptions;

  private _languagesLoaded: string[] = [];

  private _messagesLoaded: Map<string, Map<string, string>> = new Map();

  public init(options: InitOptions): void {

    this.validateInitOptions(options);

    this._options = options;

    this._options.loadPath = path.normalize(this._options.loadPath);

    let fileList: string[]

    try {
      fileList = fs.readdirSync(this._options.loadPath);
      console.log(fileList);
    } catch (error) {
      const msg = `An error occurred reading the translation files from the directory ${this._options.loadPath}.`;

      if (error.code === 'ENOENT') {
        throw new I18nError(`${msg} The directory does not exist.`, error, error.code);
      } else if (error.code === 'EPERM') {
        throw new I18nError(`${msg} There was a permission problem.`, error, error.code);
      } else {
        throw new I18nError(`${msg} Unexpected problem.`, error, (error.code ? error.code : null));
      }
    }

    fileList.forEach((fileName: string) => {
      console.log(fileName);
      const nameParts: string[] = fileName.split('.');
      console.log(nameParts);

      if((nameParts.length != 3) ||
         (nameParts[2].toLocaleLowerCase() != 'json') ||
         (nameParts[0].toLocaleLowerCase() != 'messages')
      ) {
        console.log(`The file ${fileName} is being ignored by the i18n engine.`);
        return;
      }

      let rawData: string;

      try{
        rawData = fs.readFileSync(path.join(this._options.loadPath, fileName), {encoding: 'utf8'});
      } catch (error) {
        const msg = `An error occurred reading the translation file ${path.join(this._options.loadPath, fileName)}.`;

        if (error.code === 'ENOENT') {
          throw new I18nError(`${msg} The file does not exist.`, error, error.code);
        } else if (error.code === 'EPERM') {
          throw new I18nError(`${msg} There was a permission problem.`, error, error.code);
        } else {
          throw new I18nError(`${msg} Unexpected problem.`, error, (error.code ? error.code : null));
        }
      }

      let messages: Map<string, string> = new Map();

      let obj = {}

      try {
        obj = JSON.parse(rawData);
      } catch (error) {
        throw new I18nError(`It was not possible to parse the messages file ${path.join(this._options.loadPath, fileName)}. It could be corrupted.`, error, 'PARSE_ERROR');
      }

      for (let key of Object.keys(obj) as Array<keyof typeof obj>){
        messages.set(key, obj[key]);
      }

      console.log(messages);

      this._languagesLoaded.push(nameParts[1]);

      this._messagesLoaded.set(nameParts[1], messages);
    });

    console.log(this._messagesLoaded);

    this._initialized = true;
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
      options.lng = 'en';
    }

    if (_.isEmpty(options.fallbackLng)) {
      options.fallbackLng = 'en';
    }

    if (_.isEmpty(options.loadPath)) {
      throw new I18nError('The options object loadPath property cannot be empty.', undefined, 'INIT_OBJECT_ERROR');
    }

    if (!path.isAbsolute(options.loadPath)) {
      throw new I18nError('The loadPath should be an absolute directory', undefined, 'INIT_OBJECT_ERROR');
    }
  }

  private objectToMap(obj: {}): Map<string, string> {

    let map: Map<string, string> = new Map();

    for (let key of Object.keys(obj) as Array<keyof typeof obj>){
      map.set(key, obj[key]);
    }

    return map;
  }

  get isInitialized(): boolean {
    return this._initialized;
  }
}

export const i18n = new I18n();
