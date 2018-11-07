import { ApiError } from './index';

export class UnauthorizedError extends ApiError {
  constructor(message: string = 'unauthorized', status: number = 401) {
    super(message, status);
  }
}
