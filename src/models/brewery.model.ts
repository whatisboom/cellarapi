import { Document, Model, model, Schema } from 'mongoose';
import { IBrewery } from '../types';

export interface IBreweryModel extends IBrewery, Document {
}

const BrewerySchema: Schema = new Schema({
  name: {
    type: String,
    required: true
  },
  updatedAt: Date
}, {
  versionKey: false
});

BrewerySchema.pre('save', function(next) {
  this.set('updatedAt', new Date());
  next();
});

const BreweryModel: Model<IBreweryModel> = model<IBreweryModel>('brewery', BrewerySchema);

export default BreweryModel;