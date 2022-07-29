/*
 * Copyright (c) 2022 André Andrade - alandrade21@gmail.com
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

/**
 * Interface to define the object expected in the AppConfigurator constructor.
 * 
 * For more info about how each field will be used, see the AppConfigurator
 * constructor comments.
 * 
 * @author alandrade21
 * @since 0.0.1, 2022 jul 28
 */
export interface AppConfigParams {
  /**
   * Name of the app being configured. This name will be used to create a 
   * folder structure to host the configuration and data files.
   */
  appName: string;

  /**
   * Absolute path to the development config folder structure. This structure is 
   * a copy of the system folders that will be used during production. For more 
   * info, see https://github.com/alandrade21/devTestFolders.
   */
  devConfigFolderPath: string;

  /**
   * Absolute path to the development data folder structure. This structure is 
   * a copy of the system folders that will be used during production. For more 
   * info, see https://github.com/alandrade21/devTestFolders.
   */
  devDataFolderPath: string;

  /**
   * Absolute path to the production config folder structure. If this field is
   * not present or has no data, the default folder will be used. For more info 
   * see the AppConfigurator constructor comments.
   */
  prodConfigFolderPath?: string;

  /**
   * Absolute path to the production data folder structure. If this field is
   * not present or has no data, the default folder will be used. For more info 
   * see the AppConfigurator constructor comments.
   */
  prodDataFolderPath?: string;

  /**
   * Name of the configuration file to be used. This file will have the .json 
   * extension. If this field is not present or has no data, the default name 
   * will be used. For more info see the AppConfigurator constructor comments.
   */
  configFileName?: string;

  /**
   * String to be used on the main window title bar. If this field is not present 
   * or has no data, the appName field will be used instead.
   */
  appTitle?: string;
}