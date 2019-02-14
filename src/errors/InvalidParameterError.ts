import { ErrorWrapper } from './ErrorWrapper';

/**
 * Error class to represent a invalid use of a parameter.
 */
export class InvalidParameterError extends ErrorWrapper{

  /**
   * Method to console print an error of this type, identifying the type.
   */
  public consoleLog(): void {
    console.log(`InvalidParameterError: ${this.message}`, this.error);
  }
}