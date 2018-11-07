import { Request, Response, NextFunction } from 'express';
import UserModel, { IUserModel } from '../models/user.model';
import { IQuantityModel, OwnedModel } from '../models/quantity.model';
import { ApiError } from '../errors';
import BeerModel, { IBeerModel } from '../models/beer.model';
import AuthCtrl from './auth.ctrl';

const excludeFields = '-hash -salt';

export class UsersCtrl {
  public async list(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const users: IUserModel[] = await UserModel.find({}, excludeFields);
      res.json({
        users
      });
    } catch (e) {
      return next(e);
    }
  }

  public async get(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const user: IUserModel = await UserModel.findOne(
        {
          _id: req.params.userId
        },
        excludeFields
      )
        .populate({
          path: 'owned',
          populate: {
            path: 'beer'
          }
        })
        .exec();
      if (user === null) {
        const e: ApiError = new ApiError('not-found', 404);
        throw e;
      } else {
        res.json({
          user
        });
      }
    } catch (e) {
      return next(e);
    }
  }

  public async put(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const user: IUserModel = await UserModel.findOneAndUpdate(
        {
          _id: req.params.userId
        },
        <IUserModel>req.body,
        {
          fields: excludeFields,
          new: true
        }
      ).exec();
      if (user === null) {
        const e: ApiError = new ApiError('not-found', 404);
        throw e;
      } else {
        res.json({
          user
        });
      }
    } catch (e) {
      return next(e);
    }
  }

  public async remove(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const user: IUserModel = await UserModel.findByIdAndDelete(
        req.params.userId
      );
      if (user === null) {
        const e: ApiError = new ApiError('not-found', 404);
        throw e;
      } else {
        res.sendStatus(204);
      }
    } catch (e) {
      return next(e);
    }
  }

  public async getOwnProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const user: IUserModel = await UserModel.findById(
        req.user._id,
        excludeFields
      );
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
