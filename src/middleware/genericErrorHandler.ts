import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../errors';

export function genericErrorHandler(
  error: ApiError,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (!res.headersSent) {
    res.status(error.status || 500).json({
      error
    });
  } else {
    next(error);
  }
}
