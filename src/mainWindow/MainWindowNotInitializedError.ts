import { ErrorWrapper } from '../errors/ErrorWrapper';

export class MainWindowNotInitializedError extends ErrorWrapper {
  // Override
  protected _type = 'INIT_ERROR';

  // Override
  protected _className = 'MainWindowNotInitializedError';

  constructor(){
    super('Main window not initialized');
  }
}
