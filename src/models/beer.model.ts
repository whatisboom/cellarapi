import { model, Schema } from "mongoose";

const BeerSchema = new Schema({
   name: { type: String, required: true },
   abv: Number
});

const BeerModel = model('beer', BeerSchema);

export default BeerModel;