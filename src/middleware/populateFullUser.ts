import { Request, Response, NextFunction } from 'express';

import UserModel from '../models/user.model';

export async function populateFullUser(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const user = await UserModel.findById(req.user._id, '+untappdApiKey');
    req.user = user;
    return next();
  } catch (e) {
    next(e);
  }
}
