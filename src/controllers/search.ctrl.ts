import { Request, Response, NextFunction } from 'express';
import { Untappd } from '../utils';
import { BeerCellarResponse } from '../types/response';
export class SearchCtrl {
  public async beer(
    req: Request,
    res: BeerCellarResponse,
    next: NextFunction
  ): Promise<void> {
    try {
      const api = new Untappd(req.user.untappdApiKey);
      const search = await api.searchBeer(req.query.q);
      res.data = { search };
      res.status(200);
      next();
    } catch (e) {
      return next(e);
    }
  }
}

export default new SearchCtrl();
