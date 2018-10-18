import { Request, Response } from "express";
import * as jsonwebtoken from 'jsonwebtoken';
import UserModel from '../models/user.model';

async function post(req: Request, res:Response) {
  const {
    username,
    password
  } = req.body;

  try {
    const user = await UserModel.findOne({
      username
    }, 'username salt hash');
    
    const salt = user.get('salt');

    const isValidPassword = user.schema.methods.isPasswordValid(
      password, user
    );
    if (isValidPassword) {
  
      const token = jsonwebtoken.sign({
        data: {
          user
        }
      }, process.env.JWT_SECRET, {
        expiresIn: '1h'
      });

      res.json({
        token
      });
    } else {
      res.status(401).json({
        error: 'invalid-auth'
      });
    }
  } catch (error) {
    res.json({
      error
    });
  }
  
}

const AuthCtrl = {
  post
};

export default AuthCtrl;