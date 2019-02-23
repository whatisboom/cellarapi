import { NextFunction } from 'express';
import UserModel, { IUserModel } from '../models/user.model';
import { ApiError } from '../errors';
import { ValidatedResourcesRequest } from '../types';
import { BeerCellarResponse } from '../types/response';

export class UsersCtrl {
  public async list(
    req: ValidatedResourcesRequest,
    res: BeerCellarResponse,
    next: NextFunction
  ): Promise<void> {
    try {
      const query: any = {};
      const constraints = { limit: 100 };
      if (req.query.search) {
        query.username = new RegExp(req.query.search, 'i');
      }
      if (req.query.limit) {
        const limit = parseInt(req.query.limit, 10);
        if (limit < 1000) {
          constraints.limit = limit;
        }
      }
      const users: IUserModel[] = await UserModel.find(
        query,
        null,
        constraints
      );

      res.data = {
        users
      };
      res.status(200);
      next();
    } catch (e) {
      return next(e);
    }
  }

  public async get(
    req: ValidatedResourcesRequest,
    res: BeerCellarResponse,
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
      res.data = {
        user
      };
      res.status(200);
      next();
    } catch (e) {
      return next(e);
    }
  }

  public async patch(
    req: ValidatedResourcesRequest,
    res: BeerCellarResponse,
    next: NextFunction
  ): Promise<void> {
    try {
      let user: IUserModel = req.resources.user;
      user.set(req.body);
      user = await user.save();
      res.data = {
        user
      };
      res.status(202);
      next();
    } catch (e) {
      return next(e);
    }
  }

  public async remove(
    req: ValidatedResourcesRequest,
    res: BeerCellarResponse,
    next: NextFunction
  ): Promise<void> {
    try {
      const user: IUserModel = req.resources.user;
      await user.remove();
      res.status(204);
      next();
    } catch (e) {
      return next(e);
    }
  }

  public async getOwnProfile(
    req: ValidatedResourcesRequest,
    res: BeerCellarResponse,
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
        res.data = {
          user
        };
        res.status(200);
        next();
      }
    } catch (e) {
      return next(e);
    }
  }
}

export default new UsersCtrl();
