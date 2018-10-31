import { Document, Model, model, Schema } from 'mongoose';
import * as randToken from 'rand-token';

export interface IRefreshTokenModel extends Document {}

const RefreshTokenSchema: Schema = new Schema({
  refreshToken: {
    type: String,
    unique: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  expires: {
    type: Date
  },
  createdAt: {
    type: Date
  }
});

RefreshTokenSchema.pre('validate', function(next) {
  this.set('refreshToken', randToken.uid(256));
  const now: Date = new Date();
  this.set('createdAt', now);
  const later: Date = new Date(now.getTime() + 30 * 1000 * 60 * 60 * 24); // 30 days
  this.set('expires', later);
  next();
});

export const RefreshTokenModel: Model<IRefreshTokenModel> = model<
  IRefreshTokenModel
>('refreshToken', RefreshTokenSchema);

export default RefreshTokenModel;
