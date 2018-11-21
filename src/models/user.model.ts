import { Document, Model, model, Schema } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { IUser } from '../types';

export interface IUserModel extends IUser, Document {
  [field: string]: any;
}

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
        validator: function(val: string): boolean {
          return /user/i.test(val) || this.role === 'admin';
        },
        message: (props: { value: string }): string =>
          `${props.value} is not a valid role.`
      }
    },
    hash: {
      type: String,
      select: false
    },
    salt: {
      type: String,
      select: false
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
  if (!this.get('createdAt')) {
    this.set('createdAt', new Date());
  }
  next();
});

UserSchema.pre('save', function(next) {
  this.set({
    updatedAt: new Date()
  });
  next();
});

const UserModel: Model<IUserModel> = model<IUserModel>('user', UserSchema);

export default UserModel;
