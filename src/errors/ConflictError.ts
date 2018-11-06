import { ApiError } from './index';

export class ConflictError extends ApiError {
  constructor(message: string = 'conflict', status: number = 409) {
    super(message, status);
  }
}
