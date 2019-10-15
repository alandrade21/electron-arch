import { ErrorWrapper } from '../errors/ErrorWrapper';

/**
 * Class to represent error from config file manipulation.
 */
export class ConfigFileError extends ErrorWrapper {
  // Override
  protected _type = 'RUNTIME_ERROR';

  // Override
  protected _className = 'ConfigFileError';
}
