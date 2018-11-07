import { Request, Response, NextFunction } from 'express';
import UserModel, { IUserModel } from '../models/user.model';
import { IQuantityModel, OwnedModel } from '../models/quantity.model';
import { ApiError } from '../errors';
import BeerModel, { IBeerModel } from '../models/beer.model';

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
      console.log(user);
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

  public async getOwnProfile(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
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

  public async addBeerToUser(req: Request, res: Response, next: NextFunction) {
    try {
      const user: IUserModel = await UserModel.findById(
        req.params.userId,
        excludeFields
      ).populate('owned');
      const beer: IBeerModel = await BeerModel.findById(req.body.beerId);
      const amount: number = req.body.amount;

      if (user === null) {
        throw new Error('not-found: user');
      }

      if (beer === null) {
        throw new Error('not-found: beer');
      }

      const ownedBeer: IQuantityModel = await OwnedModel.findOne({
        beer: beer._id,
        user: user._id
      });

      if (ownedBeer !== null) {
        throw new ApiError('duplicate', 409);
      }

      const createdBeer: IQuantityModel = await OwnedModel.create({
        beer: beer._id,
        user: user._id,
        amount
      });

      user.get('owned').push(createdBeer);

      await user.save();

      res.status(200).json({
        user
      });
    } catch (e) {
      next(e);
    }
  }
}

export default new UsersCtrl();
