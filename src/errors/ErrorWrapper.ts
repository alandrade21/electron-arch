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

/**
 * This is a wrapper to manipulate errors accordingly to
 * https://basarat.gitbooks.io/typescript/docs/types/exceptions.html.
 *
 * Create your own inheriting this class.
 */
export abstract class ErrorWrapper {

  protected _className = '';

  constructor(protected _message: string,
              protected _error: Error | any | null = null,
              protected _type: string | null = null) {}

  get message(): string {
    return this._message;
  }

  get error(): Error | any | null {
    return this._error;
  }

  get type(): string | null {
    return this._type;
  }

  get className(): string {
    return this._className;
  }

  /**
   * Method to console print an error of this type, identifying the type.
   */
  public consoleLog(): void {
    console.log(`${this.className}. Message: ${this.message}. Error Type: ${this.type}. Original Error: ${this.error}`);
  }
}
