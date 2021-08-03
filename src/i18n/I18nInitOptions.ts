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

 export interface I18nInitOptions {

  /**
   * Language to use
   * @default 'en'
   */
  lng?: string;

  /**
   * Language to use if translations in user language are not available.
   * @default 'en'
   */
  fallbackLng?: string;

  /**
   * Absolute path to the folder containing the translation files.
   */
  loadPath: string;

 }
