import { Response, NextFunction } from 'express';
import BeerModel, { IBeerModel } from '../models/beer.model';
import { ValidatedResourcesRequest } from '../types';

export class BeersCtrl {
  public async post(
    req: ValidatedResourcesRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const beer: IBeerModel = await BeerModel.create(req.body);
      res.json({
        beer
      });
    } catch (e) {
      next(e);
    }
  }

  public async list(
    req: ValidatedResourcesRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const beers: IBeerModel[] = await BeerModel.find({});
      res.json({
        beers
      });
    } catch (e) {
      next(e);
    }
  }

  public async get(
    req: ValidatedResourcesRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const beer: IBeerModel = req.resources.beer;
      await beer.populate('brewery').execPopulate();
      res.json({
        beer
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
      let beer: IBeerModel = req.resources.beer;
      beer.set(req.body);
      beer = await beer.save();
      res.json({
        beer
      });
    } catch (e) {
      next(e);
    }
  }

  public async remove(
    req: ValidatedResourcesRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const beer: IBeerModel = req.resources.beer;
      await beer.remove();
      res.status(204).send({});
    } catch (e) {
      next(e);
    }
  }
}

export default new BeersCtrl();
