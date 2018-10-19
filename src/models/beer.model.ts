import { model, Schema } from "mongoose";

const BeerSchema = new Schema({
  name: { type: String, required: true },
  abv: Number,
  style: String,
  brewery: { type: Schema.Types.ObjectId, ref: 'brewery' }
}, {
  versionKey: false
});

const BeerModel = model('beer', BeerSchema);

export default BeerModel;