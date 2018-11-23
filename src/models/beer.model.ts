import { Document, Model, model, Schema } from 'mongoose';
import { IBeer } from '../types';
import { kabobify } from '../utils';

export interface IBeerModel extends IBeer, Document {
  kabobify: (str: string) => string;
}

const BeerSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String },
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

BeerSchema.pre('save', function(this: IBeerModel, next) {
  this.set({
    slug: this.kabobify(this.get('name')),
    updatedAt: new Date()
  });
  next();
});

BeerSchema.methods.kabobify = kabobify;

const BeerModel: Model<IBeerModel> = model<IBeerModel>('beer', BeerSchema);

export default BeerModel;
