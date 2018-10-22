import { Request, Response, NextFunction } from "express";
import * as jsonwebtoken from 'jsonwebtoken';
import UserModel from '../models/user.model';
import * as bcrypt from 'bcryptjs';

export class AuthCtrl {
  public async signup(req: Request, res: Response, next: NextFunction): Promise<void> {
    const {
      email,
      password,
      username
    } = req.body;
    try {
      const existingUser = await UserModel.find({
        $or: [
          {
            username
          }, {
            email
          }
        ]
      });
      if (existingUser.length !== 0) {
        res.status(409).json({
          error: 'duplicate'
        });
      }
    } catch (error) {
      res.status(500).json({
        error
      });
    }
    try {
      const salt = bcrypt.genSaltSync(10);
      const user = await UserModel.create({
        email,
        username,
        hash: UserModel.schema.methods.getPasswordHash(password, salt),
        salt
      });
      res.json({
        user
      });
    } catch (e) {
      next(e)
    }
  }
  
  public async signin(req: Request, res:Response, next: NextFunction): Promise<void> {
    const {
      username,
      password,
      forever
    } = req.body;
    
    const options: jsonwebtoken.SignOptions = {};
    if (!forever) {
      options.expiresIn = '1d';
    }
  
    try {
      const user = await UserModel.findOne({
        username
      }, 'username salt hash role');
  
      const isValidPassword = user.schema.methods.isPasswordValid(
        password, user
      );
      if (isValidPassword) {
        const token = jsonwebtoken.sign({
          username: user.get('username'),
          role: user.get('role')
        }, process.env.JWT_SECRET, options);
  
        res.json({
          token
        });
      } else {
        res.status(401).json({
          error: 'invalid-auth'
        });
      }
    } catch (e) {
      next(e);
    }
    
  }  
}

export default new AuthCtrl();