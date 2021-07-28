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

/**
 * This is a wrapper to manipulate errors accordingly to
 * https://basarat.gitbooks.io/typescript/docs/types/exceptions.html.
 *
 * Create your own inheriting this class.
 * 
 * @since 0.0.1
 */
export abstract class ErrorWrapper {

  /**
   * This field must be overridden in child classes and initialized with the
   * child class name. The name of a class cannot be obtained in runtime
   * because of a possible minification that alters the class name.
   * 
   * @since 0.0.1
   */
  protected _className = '';

  /**
   * Constructor
   * 
   * @param _message The message of this error.
   * @param _causedBy Optional. A throwable object thar caused this error.
   * @param _classifier Optional. A string that classifies this error. Generally, 
   * this field is overridden in subclasses.
   * 
   * @since 0.0.1
   */
  constructor(protected _message: string,
              protected _causedBy: Error | any | null = null,
              protected _classifier: string | null = null) {}

  get message(): string {
    return this._message;
  }

  get causedBy(): Error | any | null {
    return this._causedBy;
  }

  get classifier(): string | null {
    return this._classifier;
  }

  get className(): string {
    return this._className;
  }

  /**
   * Method to console print an error of this type, identifying the type.
   * 
   * @since 0.0.1
   */
  public consoleLog(): void {
    console.log(`${this.className}. Message: ${this.message}. Error Type: ${this.classifier}. Original Error: ${this.causedBy}`);
  }
}
