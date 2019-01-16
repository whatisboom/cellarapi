import { Document, Model, model, Schema } from 'mongoose';
import { IQuantity } from '../types';

export interface IQuantityModel extends IQuantity, Document {}

const QuantitySchema: Schema = new Schema(
  {
    amount: {
      type: Number,
      required: true,
      min: 0,
      max: 1000,
      validate: {
        validator: function(v: number): boolean {
          return v >= this.forTrade;
        },
        message: 'Owned must be greater than or equal to amount For Trade'
      }
    },
    forTrade: {
      type: Number,
      min: 0,
      max: 1000,
      default: 0,
      validate: {
        validator: function(v: number): boolean {
          return v <= this.amount;
        },
        message: 'For Trade must be less than or equal to amount Owned.'
      }
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
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    versionKey: false
  }
);

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
