import { Request, Response, NextFunction } from 'express';
import BreweryModel, { IBreweryModel } from '../models/brewery.model';
import BeerModel, { IBeerModel } from '../models/beer.model';
import { ValidatedResourcesRequest } from '../types';

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
    req: ValidatedResourcesRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const brewery: IBreweryModel = req.resources.brewery;
      res.json({
        brewery
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
      let brewery: IBreweryModel = req.resources.brewery;
      brewery.set(req.body);
      brewery = await brewery.save();
      res.json({
        brewery
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
      const brewery: IBreweryModel = req.resources.brewery;
      await brewery.remove();
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
