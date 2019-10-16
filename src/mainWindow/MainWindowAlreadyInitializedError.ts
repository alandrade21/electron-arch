import { ErrorWrapper } from '../errors/ErrorWrapper';

export class MainWindowAlreadyInitializedError extends ErrorWrapper {
  // Override
  protected _type = 'INIT_ERROR';

  // Override
  protected _className = 'MainWindowAlreadyInitializedError';

  constructor(){
    super('Main window already initialized');
  }
}
