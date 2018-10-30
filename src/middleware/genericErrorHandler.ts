import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../errors';

export function genericErrorHandler(
  error: ApiError,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (!res.headersSent) {
    error.status = error.status || 500;
    res.status(error.status).json({
      error
    });
  } else {
    next(error);
  }
}
