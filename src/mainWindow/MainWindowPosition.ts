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
* along with "electron-arch". If not, see <https://www.gnu.org/licenses/>.
*/

import { app, screen } from 'electron';
import { AppNotReadyError } from '../errors/AppNotReadyError';
import { InvalidParameterError } from '../errors/InvalidParameterError';

/**
 * Class to represent the position and size of the electron main window.
 * 
 * An instance of this class is expected by the MainWindowController.
 * 
 * Helper class with static methods to obtain an instance for a maximized or 
 * centralized window.
 * 
 * @author alandrade21
 * @since 0.0.1
 */
export class MainWindowPosition {

  private _x: number;
  private _y: number;
  private _width: number;
  private _height: number;

  /**
   * @author alandrade21
   * @since 0.0.1
   */
  constructor(
    x: number,
    y: number,
    width: number,
    height: number
  ) {
    if (x < 0 || y < 0 || width < 0 || height < 0 ||
      !Number.isInteger(x) || !Number.isInteger(y) ||
      !Number.isInteger(width) || !Number.isInteger(height)
    ) {
      throw new InvalidParameterError('All the parameters must be ' +
        'positive integers.');
    }

    this._x = x;
    this._y = y;
    this._width = width;
    this._height = height;
  }

  /**
   * Static helper to get the coordinates for a maximized window in the
   * display where the mouse pointer is.
   * 
   * @returns a MainWindowPosition instance with coordinates to maximize a 
   * window in the display where the mouse pointer is.
   * @throws AppNotReadyError if app.on('ready') event not occurred yet.
   * 
   * @author alandrade21
   * @since 0.0.1
   */
  public static getMaximizedInstance(): MainWindowPosition {
    if (!app.isReady()) {
      throw new AppNotReadyError();
    }

    const displayPointed = screen.getDisplayNearestPoint(
      screen.getCursorScreenPoint());
    //const size = screen.getPrimaryDisplay().workAreaSize;
    const wa = displayPointed.workArea;
    return new MainWindowPosition(wa.x, wa.y, wa.width, wa.height);
  }

  // TODO criar método de instanciação centralizando a janela no display padrão.
  // TODO tratar mais de um display.

  ////////////////////////////////////////////////////

  /**
   * @author alandrade21
   * @since 0.0.1
   */
  public getX() {
    return this._x;
  }

  /**
   * @author alandrade21
   * @since 0.0.1
   */
  public getY() {
    return this._y;
  }

  /**
   * @author alandrade21
   * @since 0.0.1
   */
  public getWidth() {
    return this._width
  }

  /**
   * @author alandrade21
   * @since 0.0.1
   */
  public getHeight() {
    return this._height
  }
}
