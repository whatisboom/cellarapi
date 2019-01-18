import { Request, Response, NextFunction } from 'express';
import * as jsonwebtoken from 'jsonwebtoken';
import UserModel, { IUserModel } from '../models/user.model';
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
      const n = new Date();
      const existingRefreshToken: IRefreshTokenModel = await RefreshTokenModel.findOne(
        {
          refreshToken,
          expires: {
            $gte: new Date(n.getFullYear(), n.getMonth(), n.getDate())
          }
        }
      );

      if (existingRefreshToken === null) {
        const e: ApiError = new ApiError('Invalid Refresh Token');
        e.status = 401;
        throw e;
      }

      const user: IUserModel = await UserModel.findById(
        existingRefreshToken.get('userId')
      );

      const token = this.getJwtForUser(user);

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
      const refreshToken: IRefreshTokenModel = await this.getOrCreateRefreshToken(
        user._id
      );
      res.json({ user, token, refreshToken: refreshToken.get('refreshToken') });
    } catch (e) {
      next(e);
    }
  }

  private async getOrCreateRefreshToken(
    userId: string
  ): Promise<IRefreshTokenModel> {
    const n = new Date();
    let token: IRefreshTokenModel = await RefreshTokenModel.findOne({
      userId: userId,
      expires: {
        $gte: new Date(n.getFullYear(), n.getMonth(), n.getDate())
      }
    });
    if (!token) {
      token = await RefreshTokenModel.create({
        userId
      });
    }
    return token;
  }
}

export default new AuthCtrl();
