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
 * along with "electron-arch".  If not, see <https://www.gnu.org/licenses/>.
 */

import { ErrorWrapper } from '../errors/ErrorWrapper';

/**
 * Error generated if the programmer tries to access the main window before it is 
 * initialized
 * 
 * @author alandrade21
 * @since 0.0.1, 2019 mar 27
 */
export class MainWindowNotInitializedError extends ErrorWrapper {
  // Override
  protected _classifier = 'INIT_ERROR';

  // Override
  protected _className = 'MainWindowNotInitializedError';

  constructor(){
    super('Main window not yet initialized');
  }
}
