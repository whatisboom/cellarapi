import { Document, Model, model, Schema } from 'mongoose';
import { IUser } from '../types';

export interface IUserModel extends IUser, Document {
  [field: string]: any;
}

const UserSchema: Schema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      select: false
    },
    username: {
      type: String,
      required: true,
      unique: true,
      minlength: 3,
      match: [/^\w+$/, 'Invalid Username']
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
    firstName: String,
    lastName: String,
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    },
    owned: [
      {
        type: Schema.Types.ObjectId,
        ref: 'owned'
      }
    ],
    avatar: {
      type: String,
      default: 'https://placekitten.com/600/600'
    },
    location: {
      type: String
    },
    social: {
      twitter: String,
      instagram: String
    },
    untappdApiKey: {
      type: String,
      select: false
    },
    oauth: {
      untappd: {
        type: String,
        select: false
      }
    }
  },
  {
    versionKey: false
  }
);

UserSchema.pre('save', function(next) {
  this.set({
    updatedAt: new Date()
  });
  next();
});

const UserModel: Model<IUserModel> = model<IUserModel>('user', UserSchema);

export default UserModel;
