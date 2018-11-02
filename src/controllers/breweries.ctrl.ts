import { Request, Response, NextFunction } from 'express';
import BreweryModel, { IBreweryModel } from '../models/brewery.model';
import BeerModel, { IBeerModel } from '../models/beer.model';
import { ApiError } from '../errors';

export class BreweriesCtrl {
  public async post(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const brewery: IBreweryModel = await BreweryModel.create(req.body);
      res.json({
        brewery
      });
    } catch (e) {
      e.status = 404;
      return next(e);
    }
  }

  public async list(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const breweries: IBreweryModel[] = await BreweryModel.find({});
      res.json({
        breweries
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
      const brewery: IBreweryModel = await BreweryModel.findOne({
        _id: req.params.breweryId
      }).exec();
      if (brewery === null) {
        const e = new ApiError('not-found');
        e.status = 404;
        throw e;
      } else {
        res.json({
          brewery
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
      const brewery = await BreweryModel.findOneAndUpdate(
        {
          _id: req.params.breweryId
        },
        req.body,
        {
          new: true
        }
      );
      res.json({
        brewery
      });
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
      const brewery: IBreweryModel = await BreweryModel.findByIdAndDelete(
        req.params.breweryId
      );
      res.status(204).send();
    } catch (e) {
      return next(e);
    }
  }

  public async getBeersForBrewery(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const beers: IBeerModel[] = await BeerModel.find({
        brewery: req.params.breweryId
      }).populate('brewery');
      res.json({
        beers
      });
    } catch (e) {
      return next(e);
    }
  }
}

export default new BreweriesCtrl();
