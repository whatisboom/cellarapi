import { Document, Model, model, Schema } from "mongoose";
import * as bcrypt from 'bcryptjs';
import { IUser } from '../types';

export interface IUserModel extends IUser, Document {
  
}

const UserSchema: Schema = new Schema({
  email: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  role: {
    type: String,
    default: 'user'
  },
  hash: {
    type: String
  },
  salt: {
    type: String,
    default: 'SALT'
  },
  firstName: String,
  lastName: String,
  updateAd: Date,
  beers: [{
    type: Schema.Types.ObjectId,
    ref: 'beer'
  }]
}, {
  versionKey: false
});

UserSchema.methods.getPasswordHash = function(password: string, salt: string): string {
  return bcrypt.hashSync(password, salt);
}

UserSchema.methods.isPasswordValid = function(password: string, user: Schema): boolean {
  return bcrypt.compareSync(password, user.get('hash'));
}

UserSchema.pre('save', function(next) {
  this.set('updatedAt', new Date());
  next();
});

const UserModel: Model<IUserModel> = model<IUserModel>('user', UserSchema);

export default UserModel;