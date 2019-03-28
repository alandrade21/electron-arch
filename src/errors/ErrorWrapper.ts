/**
 * This is a wrapper to manipulate errors accordingly to 
 * https://basarat.gitbooks.io/typescript/docs/types/exceptions.html.
 * 
 * Create your own inheriting this class.
 */
export class ErrorWrapper {

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
}