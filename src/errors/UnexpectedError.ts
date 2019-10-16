import { ErrorWrapper } from './ErrorWrapper';

/**
 * Class to represent errors not expected in the process flow.
 */
export class UnexpectedError extends ErrorWrapper {
  // Override
  protected _type = 'RUNTIME_ERROR';

  // Override
  protected _className = 'UnexpectedError';
}
