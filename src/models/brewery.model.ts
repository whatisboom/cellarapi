import { model, Schema } from 'mongoose';

const BrewerySchema = new Schema({
  name: { type: String, required: true }
}, {
  versionKey: false
});

const BreweryModel = model('brewery', BrewerySchema);

export default BreweryModel;