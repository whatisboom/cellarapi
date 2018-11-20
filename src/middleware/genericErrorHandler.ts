import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../errors';

export function genericErrorHandler(
  error: ApiError,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (!res.headersSent) {
    if (error.name === 'CastError') {
      error = new ApiError('not-found', 404);
    }
    res.status(error.status || 500).json({
      error
    });
  } else {
    next(error);
  }
}
