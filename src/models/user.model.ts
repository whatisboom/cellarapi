import { Document, Model, model, Schema } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { IUser } from '../types';

export interface IUserModel extends IUser, Document {}

const UserSchema: Schema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true
    },
    username: {
      type: String,
      required: true,
      unique: true,
      minlength: 3
    },
    role: {
      type: String,
      enum: ['user', 'moderator', 'admin'],
      default: 'user',
      validate: {
        validator: function(val): boolean {
          return /user/i.test(val);
        },
        message: (props): string => `${props.value} is not a valid role.`
      }
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
    createdAt: Date,
    updatedAt: Date,
    owned: [
      {
        type: Schema.Types.ObjectId,
        ref: 'owned'
      }
    ]
  },
  {
    versionKey: false
  }
);

UserSchema.methods.getPasswordHash = function(
  password: string,
  salt: string
): string {
  return bcrypt.hashSync(password, salt);
};

UserSchema.methods.isPasswordValid = function(
  password: string,
  user: Schema
): boolean {
  return bcrypt.compareSync(password, user.get('hash'));
};

UserSchema.pre('validate', function(next) {
  this.set('createdAt', new Date());
  next();
});

UserSchema.pre('findOneAndUpdate', function(next) {
  this.update({
    updatedAt: new Date()
  });
  next();
});

const UserModel: Model<IUserModel> = model<IUserModel>('user', UserSchema);

export default UserModel;
