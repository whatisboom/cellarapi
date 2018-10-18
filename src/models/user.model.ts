import { model, Schema } from "mongoose";

const UserSchema = new Schema({
   email: { type: String, required: true },
   username: { type: String, required: true },
   firstName: String,
   lastName: String,
   beers: [{ type: Schema.Types.ObjectId, ref: 'beer' }]
});

const UserModel = model('user', UserSchema);

export default UserModel;