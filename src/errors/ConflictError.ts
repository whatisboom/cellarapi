import { ApiError } from './index';

export class ConflictError extends ApiError {
  public message: string = 'conflict';
}
