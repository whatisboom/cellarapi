import { Request, Response, NextFunction } from 'express';
import * as jsonwebtoken from 'jsonwebtoken';
import UserModel, { IUserModel } from '../models/user.model';
import * as bcrypt from 'bcryptjs';
import { ApiError } from '../errors';
import RefreshTokenModel, {
  IRefreshTokenModel
} from '../models/refresh-token.model';
import { Untappd } from '../utils';

import fetch from 'node-fetch';

const excludeFields: string[] = ['hash', 'salt'];

export class AuthCtrl {
  constructor() {
    this.signin = this.signin.bind(this);
    this.getAccessToken = this.getAccessToken.bind(this);
    this.getOrCreateRefreshToken = this.getOrCreateRefreshToken.bind(this);
  }
  public async signup(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { email, password, role, username, firstName, lastName } = req.body;
    try {
      const salt = bcrypt.genSaltSync(10);
      let user: IUserModel = new UserModel({
        email,
        firstName,
        lastName,
        role,
        username,
        hash: UserModel.schema.methods.getPasswordHash(password, salt),
        salt
      });
      await user.save();
      excludeFields.forEach((field: string) => {
        user[field] = undefined;
      });
      res.json({
        user
      });
    } catch (e) {
      return next(e);
    }
  }

  public async signin(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { username, password } = req.body;
    try {
      const user: IUserModel = await UserModel.findOne(
        {
          username
        },
        'username _id salt hash role'
      );

      const isValidPassword: boolean = user.schema.methods.isPasswordValid(
        password,
        user
      );

      if (isValidPassword) {
        const refreshToken: IRefreshTokenModel = await this.getOrCreateRefreshToken(
          user._id
        );
        const token: string = this.getJwtForUser(user);

        res.json({
          refreshToken: refreshToken.get('refreshToken'),
          token
        });
      } else {
        const e: ApiError = new ApiError('invalid-auth');
        e.status = 401;
        throw e;
      }
    } catch (e) {
      next(e);
    }
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
      const user = untappdClient.oauthAndCreateUser(code);
      res.json({ user });
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
