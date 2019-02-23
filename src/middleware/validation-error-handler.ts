import { Request, Response, NextFunction } from 'express';
import { Error } from 'mongoose';

export interface MongoValidationError extends Error {
  errors: {
    [key: string]: Error;
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
