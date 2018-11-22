import { Document, Model, model, Schema } from 'mongoose';
import { IBrewery } from '../types';

export interface IBreweryModel extends IBrewery, Document {}

const BrewerySchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    city: String,
    state: String,
    country: String,
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

BrewerySchema.pre('save', function(next) {
  this.set({
    updatedAt: new Date()
  });
  next();
});

const BreweryModel: Model<IBreweryModel> = model<IBreweryModel>(
  'brewery',
  BrewerySchema
);

export default BreweryModel;
