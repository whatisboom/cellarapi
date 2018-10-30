import { Document, Model, model, Schema } from 'mongoose';
import { IQuantity } from '../types';

export interface IQuantityModel extends IQuantity, Document {}

const QuantitySchema: Schema = new Schema(
  {
    amount: {
      type: Number,
      required: true
    },
    beer: {
      type: Schema.Types.ObjectId,
      ref: 'beer',
      required: true
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true
    },
    createdAt: Date,
    updatedAt: Date
  },
  {
    versionKey: false
  }
);

QuantitySchema.pre('save', function(next) {
  this.set('createdAt', new Date());
  next();
});

QuantitySchema.pre('findOneAndUpdate', function(next) {
  this.update({
    updatedAt: new Date()
  });
  next();
});

export const OwnedModel: Model<IQuantityModel> = model<IQuantityModel>(
  'owned',
  QuantitySchema
);
