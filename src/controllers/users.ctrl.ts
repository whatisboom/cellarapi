import { Response, NextFunction } from 'express';
import UserModel, { IUserModel } from '../models/user.model';
import { ApiError } from '../errors';
import { ValidatedResourcesRequest } from '../types';

export class UsersCtrl {
  public async list(
    req: ValidatedResourcesRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const query: any = {};
      if (req.query.search) {
        query.username = new RegExp(req.query.search, 'i');
      }
      const users: IUserModel[] = await UserModel.find(query);
      res.json({
        users
      });
    } catch (e) {
      return next(e);
    }
  }

  public async get(
    req: ValidatedResourcesRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const user: IUserModel = req.resources.user;
      await user
        .populate({
          path: 'owned',
          populate: {
            path: 'beer',
            populate: {
              path: 'brewery'
            }
          }
        })
        .execPopulate();
      res.json({
        user
      });
    } catch (e) {
      return next(e);
    }
  }

  public async patch(
    req: ValidatedResourcesRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      let user: IUserModel = req.resources.user;
      user.set(req.body);
      user = await user.save();
      res.json({
        user
      });
    } catch (e) {
      return next(e);
    }
  }

  public async remove(
    req: ValidatedResourcesRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const user: IUserModel = req.resources.user;
      await user.remove();
      res.sendStatus(204);
    } catch (e) {
      return next(e);
    }
  }

  public async getOwnProfile(
    req: ValidatedResourcesRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const user: IUserModel = await UserModel.findById(req.user._id).populate({
        path: 'owned',
        populate: {
          path: 'beer',
          populate: {
            path: 'brewery'
          }
        }
      });
      if (user === null) {
        const e: ApiError = new ApiError('not-found', 404);
        throw e;
      } else {
        res.status(200).json({
          user
        });
      }
    } catch (e) {
      return next(e);
    }
  }
}

export default new UsersCtrl();
