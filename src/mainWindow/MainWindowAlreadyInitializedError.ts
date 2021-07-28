/*
 * Copyright (c) 2021 André Andrade - alandrade21@gmail.com
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

import { ErrorWrapper } from '../errors/ErrorWrapper';

/**
 * Error generated if the programmer tries to initialize an already initialized 
 * main window.
 * 
 * @since 0.0.1
 */
export class MainWindowAlreadyInitializedError extends ErrorWrapper {
  // Override
  protected _classifier = 'INIT_ERROR';

  // Override
  protected _className = 'MainWindowAlreadyInitializedError';

  constructor(){
    super('Main window already initialized');
  }
}
