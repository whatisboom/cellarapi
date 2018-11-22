import { Document, Model, model, Schema } from 'mongoose';
import { IBeer } from '../types';

export interface IBeerModel extends IBeer, Document {}

const BeerSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    abv: Number,
    style: String,
    brewery: { type: Schema.Types.ObjectId, ref: 'brewery' },
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

BeerSchema.pre('save', function(next) {
  this.set({
    updatedAt: new Date()
  });
  next();
});

const BeerModel: Model<IBeerModel> = model<IBeerModel>('beer', BeerSchema);

export default BeerModel;
