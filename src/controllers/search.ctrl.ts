import { Request, Response, NextFunction } from 'express';
export class SearchCtrl {
  public async beer(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      res.json({
        key: req.user.untappdApiKey
      });
    } catch (e) {
      return next(e);
    }
  }
}

export default new SearchCtrl();
