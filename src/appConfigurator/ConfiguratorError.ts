import { ErrorWrapper } from '../errors/ErrorWrapper';

/**
 * Class to represent erros generate inside the configurator.
 *
 * This was created for type safety.
 */
export class ConfiguratorError extends ErrorWrapper {

  // Override
  protected _className = 'ConfiguratorError';
}
