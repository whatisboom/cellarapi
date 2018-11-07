import { Request, Response, NextFunction } from 'express';
import UserModel, { IUserModel } from '../models/user.model';
import { IQuantityModel, OwnedModel } from '../models/quantity.model';
import BeerModel, { IBeerModel } from '../models/beer.model';
import { ApiError } from '../errors';

const excludeFields = '-hash -salt';

export class InventoryCtrl {
  public async addBeerToUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
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

  public async getUsersBeers(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const ownedBeers: IQuantityModel[] = await OwnedModel.find({
        user: req.user._id
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
