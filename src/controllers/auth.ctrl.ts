import { Request, Response, NextFunction } from 'express';
import * as jsonwebtoken from 'jsonwebtoken';
import { IUserModel } from '../models/user.model';
import { ApiError } from '../errors';
import RefreshTokenModel, {
  IRefreshTokenModel
} from '../models/refresh-token.model';
import { Untappd } from '../utils';

export class AuthCtrl {
  constructor() {
    this.getAccessToken = this.getAccessToken.bind(this);
    this.getOrCreateRefreshToken = this.getOrCreateRefreshToken.bind(this);
    this.oauth = this.oauth.bind(this);
  }

  public async getAccessToken(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { refreshToken } = req.body;
      const existingRefreshToken: IRefreshTokenModel = await RefreshTokenModel.findOne(
        {
          refreshToken,
          userId: req.user._id,
          expires: {
            $gt: new Date()
          }
        }
      );

      if (existingRefreshToken === null) {
        const e: ApiError = new ApiError('unauthorized');
        e.status = 401;
        throw e;
      }

      const token = this.getJwtForUser(req.user);

      res.json({
        token
      });
    } catch (e) {
      return next(e);
    }
  }

  public getJwtForUser(user: IUserModel): string {
    return jsonwebtoken.sign(
      {
        _id: user._id,
        username: user.username,
        role: user.role
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '1d'
      }
    );
  }

  public async oauth(req: Request, res: Response, next: NextFunction) {
    const code = req.body.code;
    const untappdClient = new Untappd();
    try {
      const user = await untappdClient.oauthAndCreateUser(code);
      const token = this.getJwtForUser(user);
      res.json({ user, token });
    } catch (e) {
      next(e);
    }
  }

  private async getOrCreateRefreshToken(
    uid: string
  ): Promise<IRefreshTokenModel> {
    let token: IRefreshTokenModel = await RefreshTokenModel.findOne({
      userId: uid,
      expires: {
        $gt: new Date()
      }
    });
    if (!token) {
      token = await RefreshTokenModel.create({
        userId: uid
      });
    }
    return token;
  }
}

export default new AuthCtrl();
