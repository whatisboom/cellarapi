import { Request, Response, NextFunction } from 'express';
export interface RouterMiddleware {
  (e: Error, req: Request, res: Response, next: NextFunction): void;
}
