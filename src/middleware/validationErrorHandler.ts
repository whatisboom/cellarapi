import { Request, Response, NextFunction } from 'express';
import { ValidationError } from 'mongoose';

export interface MongoValidationError extends ValidationError {
  errors: {
    [key: string]: ValidationError;
  };
}

export function validationErrorHandler(
  error: MongoValidationError,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (!res.headersSent && error.errors) {
    res.status(400).json({
      errors: error.errors
    });
  } else {
    next(error);
  }
}
