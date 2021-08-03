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

import { screen } from 'electron';

/**
 * Class to represent the position and size of the electron main window.
 * 
 * An instance of this class is expected by the MainWindowController.
 * 
 * Helper class with static methods to obtain an instance for a maximized or 
 * centralized window.
 * 
 * @since 0.0.1
 */
export class MainWindowPosition {

  // TODO testar comportamento com valores negativos e fracionários.
  public x: number;
  public y: number;
  public width: number;
  public height: number;

  constructor(x: number,
              y: number,
              width: number,
              height: number) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  public static getMaximizedInstance(): MainWindowPosition {
    const size = screen.getPrimaryDisplay().workAreaSize;
    return new MainWindowPosition(0,0, size.width, size.height);
  }

  // TODO criar método de instanciação centralizando a janela no display padrão.
  // TODO tratar mais de um display.
}