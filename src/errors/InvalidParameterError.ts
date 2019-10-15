import { ErrorWrapper } from './ErrorWrapper';

/**
 * Error class to represent a invalid use of a parameter.
 */
export class InvalidParameterError extends ErrorWrapper{

  // Override
  protected _type = 'RUNTIME_ERROR';

  // Override
  protected _className = 'InvalidParameterError';
}
