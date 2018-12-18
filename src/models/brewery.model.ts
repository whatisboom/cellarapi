import { Document, Model, model, Schema } from 'mongoose';
import { IBrewery } from '../types';
import { kabobify } from '../utils';

export interface IBreweryModel extends IBrewery, Document {
  untappdId: number;
}

const BrewerySchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true
    },
    slug: { type: String, unique: true },
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
    },
    untappdId: {
      type: Number,
      required: true,
      unique: true
    }
  },
  {
    versionKey: false
  }
);

BrewerySchema.pre('save', function(this: IBreweryModel, next) {
  this.set({
    updatedAt: new Date()
  });
  next();
});

BrewerySchema.methods.kabobify = kabobify;

const BreweryModel: Model<IBreweryModel> = model<IBreweryModel>(
  'brewery',
  BrewerySchema
);

export default BreweryModel;
