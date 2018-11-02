import { Request, Response, NextFunction } from 'express';
import UserModel, { IUserModel } from '../models/user.model';
import { IQuantityModel, OwnedModel } from '../models/quantity.model';
import { ApiError } from '../errors';
import BeerModel, { IBeerModel } from '../models/beer.model';
import AuthCtrl from './auth.ctrl';

const excludeFields = '-hash -salt';

export class UsersCtrl {
  public post = AuthCtrl.signup; // duplicating method

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
        const e: ApiError = new ApiError('not-found');
        e.status = 404;
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
        const e: ApiError = new ApiError('not-found');
        e.status = 404;
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
        const e: ApiError = new ApiError('not-found');
        e.status = 404;
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
        const e: ApiError = new ApiError('not-found');
        e.status = 404;
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

  public async addBeerToOwned(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.params.userId;

      // no destructuring since i'm using
      // beerId for clarity/readability
      const amount = req.body.amount;
      const beerId = req.body.beer;

      const userDocument: IUserModel = await UserModel.findOne(
        {
          _id: userId
        },
        excludeFields
      );

      const beerDocument: IBeerModel = await BeerModel.findOne({
        _id: beerId
      });

      if (userDocument === null || beerDocument === null) {
        const e: ApiError = new ApiError('not-found');
        e.status = 404;
        throw e;
      } else {
        // if user and beer documents exist
        // try to get/update the owned beer quantity
        let ownedBeer: IQuantityModel = await OwnedModel.findOneAndUpdate(
          {
            beer: beerId,
            userId: userDocument._id
          },
          {
            amount
          },
          {
            new: true
          }
        );

        const userBeers: IQuantityModel[] = userDocument.get('owned');

        if (ownedBeer === null) {
          // if the quantity document doesn't exist
          // create one linking user and beer with amount
          ownedBeer = await OwnedModel.create({
            userId: userDocument._id,
            beer: beerId,
            amount
          });
          // push the created beer to their owned list
          userBeers.push(ownedBeer);
        }
        await userDocument
          .populate({
            path: 'owned',
            // omit userId since its attached to the user
            select: '-userId',
            populate: {
              path: 'beer'
            }
          })
          .execPopulate();
        await userDocument.save();
        res.json({
          user: userDocument
        });
      }
    } catch (e) {
      return next(e);
    }
  }
}

export default new UsersCtrl();
