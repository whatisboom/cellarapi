import { Response, NextFunction } from 'express';
import { IUserModel } from '../models/user.model';
import { IQuantityModel, OwnedModel } from '../models/quantity.model';
import { IBeerModel } from '../models/beer.model';
import { ApiError } from '../errors';
import { ValidatedResourcesRequest } from '../types';

export class InventoryCtrl {
  public async addBeerToUser(
    req: ValidatedResourcesRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const user: IUserModel = req.resources.user;
      await user.populate('owned').execPopulate();
      const beer: IBeerModel = req.resources.beer;

      const amount: number = req.body.amount;

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

  public async updateBeerQuantity(
    req: ValidatedResourcesRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { amount } = req.body;
      const user: IUserModel = req.resources.user;
      const beer: IBeerModel = req.resources.beer;
      const ownedBeer: IQuantityModel = await OwnedModel.findOneAndUpdate(
        {
          beer: beer._id,
          user: user._id
        },
        { amount },
        {
          new: true
        }
      );
      if (ownedBeer === null) {
        throw new ApiError('not-found: owned', 404);
      }
      res.status(200).json({
        beer: ownedBeer
      });
    } catch (e) {
      next(e);
    }
  }

  public async getUsersBeers(
    req: ValidatedResourcesRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const ownedBeers: IQuantityModel[] = await OwnedModel.find({
        user: req.resources.user._id
      }).populate({
        path: 'beer',
        populate: {
          path: 'brewery'
        }
      });
      res.status(200).json({
        beers: ownedBeers
      });
    } catch (e) {
      next(e);
    }
  }
}

export default new InventoryCtrl();
