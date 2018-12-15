import { Request, Response, NextFunction } from 'express';
import { Untappd } from '../utils';
export class SearchCtrl {
  public async beer(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const api = new Untappd(req.user.untappdApiKey);
      const search = await api.searchBeer(req.query.q);
      res.json(search);
    } catch (e) {
      return next(e);
    }
  }
}

export default new SearchCtrl();
