import { Request, Response, NextFunction } from 'express';
import BreweryModel, { IBreweryModel } from '../models/brewery.model';

export class BreweriesCtrl {

  public async post(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const brewery: IBreweryModel = await BreweryModel.create(req.body);
      res.json({
        brewery
      });
    } catch (e) {
      e.status = 404;
      next(e);
    }
  }
  
  public async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const breweries: IBreweryModel[] = await BreweryModel.find({});
      res.json({
        breweries
      });
    } catch (e) {
      next(e)
    }
  }
  
  public async get(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const brewery: IBreweryModel = await BreweryModel.findOne({
        _id: req.params.breweryId
      }).exec();
      res.json({
        brewery
      });
    } catch(e) {
      next(e);
    }
    
  }
  
  public async put(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const brewery = await BreweryModel.findOneAndUpdate({
        _id: req.params.breweryId
      }, req.body);
      res.json({
        brewery
      });
    } catch (e) {
      next(e);
    }
  }
  
  public async remove(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const brewery: IBreweryModel = await BreweryModel.findByIdAndDelete(req.params.breweryId);
      res.status(204).send();
    } catch(e) {
      next(e);
    }
  }
}

export default new BreweriesCtrl();