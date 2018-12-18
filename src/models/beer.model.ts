import { Document, Model, model, Schema } from 'mongoose';
import { IBeer } from '../types';

export interface IBeerModel extends IBeer, Document {}

const BeerSchema: Schema = new Schema(
  {
    name: { type: String, unique: true },
    slug: { type: String, unique: true },
    abv: Number,
    style: String,
    brewery: { type: Schema.Types.ObjectId, ref: 'brewery' },
    untappdId: {
      type: Number,
      required: true,
      unique: true
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

BeerSchema.pre('save', async function(this: IBeerModel, next) {
  this.set({
    updatedAt: new Date()
  });
  next();
});

const BeerModel: Model<IBeerModel> = model<IBeerModel>('beer', BeerSchema);

export default BeerModel;
