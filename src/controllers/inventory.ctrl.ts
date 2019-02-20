import { Response, NextFunction } from 'express';
import UserModel, { IUserModel } from '../models/user.model';
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
      const forTrade: number = req.body.forTrade;

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
        amount,
        forTrade
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
      const { amount, forTrade } = req.body;
      const user: IUserModel = req.user;
      const ownedBeer: IQuantityModel = req.resources.owned;
      if (user._id !== ownedBeer.get('user').toString()) {
        throw new Error('401 denied');
      }
      if (amount) {
        ownedBeer.set({ amount });
      }
      if (forTrade) {
        ownedBeer.set({ forTrade });
      }

      await ownedBeer.save();
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

  public async deleteOwnedBeer(
    req: ValidatedResourcesRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const owned: IQuantityModel = req.resources.owned;
      const user = await UserModel.findById(owned.user);
      const beers = user.get('owned');
      const ownedIndex = beers.findIndex((item: string) => item === owned._id);
      beers.splice(ownedIndex, 1);
      await user.save();
      await owned.remove();
      res.status(204).send({});
    } catch (e) {
      return next(e);
    }
  }
}

export default new InventoryCtrl();
