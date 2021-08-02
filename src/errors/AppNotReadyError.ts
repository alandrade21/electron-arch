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
* along with 
.  If not, see <https://www.gnu.org/licenses/>.
*/

import { ErrorWrapper } from './ErrorWrapper';

/**
 * Error class to represent a state where the app.on('ready') event was not fired
 * yet.
 * 
 * @since 0.0.1
 */
export class AppNotReadyError extends ErrorWrapper{

  // Override
  protected _classifier = 'RUNTIME_ERROR';

  // Override
  protected _className = 'AppNotReadyError';

  constructor(){
    super('The app.on(\'ready\') event was not fired yet.');
  }

}