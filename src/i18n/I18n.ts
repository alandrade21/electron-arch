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
 * along with "electron-arch".  If not, see <https://www.gnu.org/licenses/>.
 */

import * as path from 'path';
import * as _ from 'lodash';
import * as fs from 'fs';

import { I18nInitOptions } from './I18nInitOptions';
import { InvalidParameterError } from '../errors/InvalidParameterError';
import { I18nError } from './I18nError';
import { runInNewContext } from 'vm';

/**
 * i18n engine.
 */
class I18n {

  // Indicates that the component was initialized (all translations loaded).
  private _initialized: boolean = false;

  // Object used to initialize the component.
  private _options: I18nInitOptions;

  // List of language translations loaded.
  private _languagesLoaded: string[] = [];

  // Map of language id => translations map, except the fallback language.
  private _messagesLoaded: Map<string, Map<string, string>> = new Map();

  // Translations for the fallback language.
  private _fallBackMessages: Map<string, string>;

  // Language in current use
  private _usingLanguage: string = 'en';

  // Messages for the language in current use.
  private _usingMessages: Map<string, string>;

  /**
   * This method initializes the i18n engine, using an initialization object.
   *
   * The initialization process read the translations files from the disk using the load path provided in
   * the initialization object. Each filename must be on the format messages.<<language ID>>.json.
   * For example, are valid names messages.en.json and messages.pt-BR.json.
   *
   * Files that not follow this rule will be ignored.
   *
   * The content of each translation file will be converted to a key => value map.
   *
   * All translations will be loaded to a language => translations map, except the translations to the
   * fallback language. This translation will be stored in a separated location.
   *
   * @param options object containing initialization parameters.
   *
   * @throws I18nError in case of the component is already initialized, in case of errors reading the
   * content of the load path, in case of errors reading a translation file from disk, in case of any
   * problem in any translation file format, in the case of the current configured language translation
   * file was not found or in the case of the fallback language file was not found.
   */
  public init(options: I18nInitOptions): void {

    // It's not possible initialize this component more then one time.
    if (this._initialized) {
      throw new I18nError(`The i18n engine is already initialized.`);
    }

    // Validate the options object and store it. The path normalization is to avoid problems in windows os.
    this.validateInitOptions(options);
    this._options = options;
    this._options.loadPath = path.normalize(this._options.loadPath);
    if (this._options.lng) {
      this._usingLanguage = this._options.lng;
    }

    // Read the list of all filenames in the load path.
    let fileList: string[];
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

    // The filenames will be split to an array. The index of each part is as below.
    const BASE_FILENAME_INDEX = 0;
    const LANGUAGE_ID_INDEX = 1;
    const EXTENSION_INDEX = 2;

    // Main loop. The translation files are loaded here.
    fileList.forEach((fileName: string) => {

      // Split the name of each file and run a basic check.
      const nameParts: string[] = fileName.split('.');
      if((nameParts.length != 3) ||
         (nameParts[EXTENSION_INDEX] !== 'json') ||
         (nameParts[BASE_FILENAME_INDEX] !== 'messages')
      ) {
        console.log(`The file ${fileName} is being ignored by the i18n engine.`);
        return;
      }

      // Load a translation file from disk.
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

      // Verify if the translation file content is well formed.
      let obj = {};
      try {
        obj = JSON.parse(rawData);
      } catch (error) {
        throw new I18nError(`It was not possible to parse the messages file ${path.join(this._options.loadPath, fileName)}. It could be corrupted.`, error, 'PARSE_ERROR');
      }

      // Construct the map for the loaded file.
      const messages: Map<string, string> = this.objectToMap(obj);
      this._languagesLoaded.push(nameParts[LANGUAGE_ID_INDEX]);

      // Store the translation map inside a language => "translation map" map, except for the fallback lang.
      if (nameParts[LANGUAGE_ID_INDEX] !== this._options.fallbackLng) {
        this._messagesLoaded.set(nameParts[LANGUAGE_ID_INDEX], messages);
      } else {
        this._fallBackMessages = messages;
      }

      // Current using this language.
      if (nameParts[LANGUAGE_ID_INDEX] === this._usingLanguage) {
        this._usingMessages = messages;
      }
    });

    if (!this._usingMessages) {
      throw new I18nError(`The translation file to the current configured language was not found.`);
    }

    if (!this._fallBackMessages) {
      throw new I18nError(`The translation file to the fallback language was not found.`);
    }

    this._initialized = true;
  }

  /**
   * Validate the values of the initialization object. In case of any error, throw an error object.
   *
   * This method provided default values to absent optional properties.
   *
   * @param options Initialization object to be validated.
   *
   * @throws InvalidParameterError in caso of no initialization object passed.
   * @throws I18nError in case of validation error.
   */
  private validateInitOptions(options: I18nInitOptions): void {

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

  /**
   * This is a recursive utility function to convert a json object containing the i18n translations to a
   * "key => value" map.
   *
   * The basic use case is when the json object is in the format below:
   *
   * {
   *   key1: value1,
   *   key2: value2,
   *   ...
   *   keyN: value N
   * }
   *
   * This case is converted to a map:
   *
   * key1 => value1, key2 => value2, ..., keyN => valueN.
   *
   * The object can contain sub-objects, as shown below:
   *
   * {
   *   key1: value1,
   *   key2: {
   *     subKey1: subValue1,
   *     subKey2: subValue2,
   *     ...
   *     subkeyN: subValueN
   *   },
   *   ...
   *   keyN: value N
   * }
   *
   * In this case, the expected output is the map:
   *
   * key1 => value1, key2.subKey1 => subValue1, key2.subKey2 => subValue2, ..., key2.subKeyN => subValueN,
   * ..., keyN => valueN.
   *
   * Observe the composition made in the key (i.e. key2.subKey2) in this case.
   *
   * This behavior is obtained recursively calling this method. The object is passed as the obj param,
   * and the key containing the sub object (key2 in the example), is passed as the recursiveKey parameter.
   *
   * This method can handle, theoretically, any depth of sub objects.
   *
   * The code that calls this method should only use the obj parameter. The recursiveKey parameter should be
   * used by the recursive calls.
   *
   * @param obj json object containing the i18n translations for a determined language.
   * @param recursiveKey a key from the object that contains a sub object. Projected to be used only for
   * recursive calls.
   *
   * @returns A key => translation map constructed from the obj parameter.
   */
  private objectToMap(obj: {}, recursiveKey?: string | null): Map<string, string> {

    let map: Map<string, string> = new Map();

    /* The construction "let key of Object.keys(obj)" causes an error in the TS transpiler, because
     * the transpiler identify the type of the key object as string and cannot iterate over it. To
     * solve this problem, the construction "as Array<keyof typeof obj>" provide a list of types,
     * one for each field of the obj.
     *
     * In practice, this for iterate over all the field of the obj.
     */
    for (let key of Object.keys(obj) as Array<keyof typeof obj>){

      if (typeof obj[key] === 'string' ) { // not a sub object.

        // If this is a recursive call, compose the name of the key.
        recursiveKey ? map.set(`${recursiveKey}.${key}`, obj[key]) : map.set(key, obj[key]);

      } else { // sub object.

        // Recursive call.
        let subMab: Map<string, string> = this.objectToMap(obj[key], key);

        subMab.forEach((subValue: string, subKey: string) => {

          // If this recursive call is made inside other recursive call, compose the name of the key.
          recursiveKey ? map.set(`${recursiveKey}.${subKey}`, subValue) : map.set(subKey, subValue);
        });
      }
    }

    return map;
  }

  /**
   * Return a translation to a given key in the actual selected language.
   *
   * If no key, or an empty key is provided, this method returns an empty string.
   *
   * If the key translation were not found in the current set language, it will be looked into the
   * fallback language. If the key were not found into the fallback language, so the value of the key is
   * returned.
   *
   * @param key key used to search a translation inside the selected language.
   *
   * @returns The translation to the key in the current selected language, a empty string in case the key
   * is empty, The translation to the key in the fallback language in the case the key were not found in the
   * current selected language, the value of the key in the case the key were not found in the fallback
   * language.
   */
  public t(key: string): string {

    if (!this._initialized) {
      throw new I18nError('The i18n engine was not initialized. Call the init method before using this service.');
    }

    if (_.isEmpty(key)) {
      return '';
    }

    let translation: string | undefined = this._usingMessages.get(key);

    if (!translation && this._usingLanguage !== this._options.fallbackLng) {
      translation = this._fallBackMessages.get(key);
    }

    if (!translation) {
      return key;
    }

    return translation;
  }

  /**
   *
   * @param languageId
   */
  public changeLanguage(languageId: string): void {

    if (!this._initialized) {
      throw new I18nError('The i18n engine was not initialized. Call the init method before using this service.');
    }

    if (_.isEmpty(languageId)) {
      throw new InvalidParameterError('The languageId parameter must not be empty.');
    }

    if (this._languagesLoaded.indexOf(languageId) == -1) {
      throw new I18nError(`The language ${languageId} was not loaded.`);
    }

    if (this._usingLanguage === languageId) {
      return;
    }

    this._usingLanguage = languageId;

    if (languageId !== this._options.fallbackLng) {
      const messages = this._messagesLoaded.get(languageId);
      if (messages) {
        this._usingMessages = messages;
      } else {
        throw new I18nError(`The translations for the language ${languageId} were not found.`);
      }
    } else {
      this._usingMessages = this._fallBackMessages;
    }
  }

  get isInitialized(): boolean {
    return this._initialized;
  }
}

export const i18n = new I18n();
