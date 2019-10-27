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

export * from './appConfigurator/AppConfigurator';
export * from './appConfigurator/ConfigData';
export * from './configFileManager/ConfigFileManager';
export * from './environmentDetector/EnvironmentDetector';
export * from './mainWindow/MainWindowController';

// Error classes.
export * from './errors/ErrorWrapper';
export * from './errors/InvalidParameterError';
export * from './errors/UnexpectedError';
export * from './configFileManager/ConfigFileError';
export * from './mainWindow/MainWindowAlreadyInitializedError';
export * from './mainWindow/MainWindowNotInitializedError';
export * from './appConfigurator/InvalidPlatformError';
