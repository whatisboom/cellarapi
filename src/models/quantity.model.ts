import { Document, Model, model, Schema } from 'mongoose';
import { IQuantity } from '../types';

export interface IQuantityModel extends IQuantity, Document {}

const QuantitySchema: Schema = new Schema(
  {
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    beer: {
      type: Schema.Types.ObjectId,
      ref: 'beer',
      required: true
    },
    user: {
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

QuantitySchema.pre('validate', function(next) {
  if (!this.get('createdAt')) {
    this.set('createdAt', new Date());
  }
  next();
});

QuantitySchema.pre('save', function(next) {
  this.set({
    updatedAt: new Date()
  });
  next();
});

export const OwnedModel: Model<IQuantityModel> = model<IQuantityModel>(
  'owned',
  QuantitySchema
);
