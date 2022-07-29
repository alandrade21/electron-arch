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

import { ErrorWrapper } from './ErrorWrapper';

/**
 * Error class to represent a invalid use of a parameter.
 * 
 * @author alandrade21
 * @since 0.0.1, 2019 feb 13
 */
export class InvalidParameterError extends ErrorWrapper{

  // Override
  protected _classifier = 'RUNTIME_ERROR';

  // Override
  protected _className = 'InvalidParameterError';
}
