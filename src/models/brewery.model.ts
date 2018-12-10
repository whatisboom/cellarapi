import { Document, Model, model, Schema } from 'mongoose';
import { IBrewery } from '../types';
import { kabobify } from '../utils';

export interface IBreweryModel extends IBrewery, Document {
  kabobify: (str: string) => string;
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
    }
  },
  {
    versionKey: false
  }
);

BrewerySchema.pre('save', function(this: IBreweryModel, next) {
  this.set({
    slug: this.kabobify(this.get('name')),
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
