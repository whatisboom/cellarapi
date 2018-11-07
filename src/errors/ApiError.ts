export class ApiError extends Error {
  status: number;
  constructor(message: string = 'unknown error', status: number = 500) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
    this.status = status;
  }
}
