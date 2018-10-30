import { ApiError } from './index';

export class UnauthorizedError extends ApiError {
  public message: string = 'unauthorized';
}
