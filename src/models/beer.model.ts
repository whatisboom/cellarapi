import { Document, Model, model, Schema } from 'mongoose';
import { IBeer } from '../types';

export interface IBeerModel extends IBeer, Document {}

const BeerSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    abv: Number,
    style: String,
    brewery: { type: Schema.Types.ObjectId, ref: 'brewery' },
    createdAt: Date,
    updatedAt: Date
  },
  {
    versionKey: false
  }
);

BeerSchema.pre('validate', function(next) {
  this.set('createdAt', new Date());
  next();
});

BeerSchema.pre('findOneAndUpdate', function(next) {
  this.update({
    updatedAt: new Date()
  });
  next();
});

const BeerModel: Model<IBeerModel> = model<IBeerModel>('beer', BeerSchema);

export default BeerModel;
