import { model, Schema } from "mongoose";

const BeerSchema = new Schema({
   name: { type: String, required: true },
   abv: Number,
   brewery: { type: Schema.Types.ObjectId, ref: 'brewery' }
});

const BeerModel = model('beer', BeerSchema);

export default BeerModel;