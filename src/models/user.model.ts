import { model, Schema } from "mongoose";
import * as bcrypt from 'bcryptjs';

const UserSchema = new Schema({
   email: {
      type: String,
      required: true
   },
   username: {
      type: String,
      required: true
   },
   hash: {
      type: String
   },
   salt: {
      type: String,
      default: 'SALT'
   },
   firstName: String,
   lastName: String,
   beers: [{
      type: Schema.Types.ObjectId,
      ref: 'beer'
   }]
});

UserSchema.methods.getPasswordHash = function(password: string, salt: string): string {
   return bcrypt.hashSync(password, salt);
}

UserSchema.methods.isPasswordValid = function(password: string, user: Schema): boolean {
   return bcrypt.compareSync(password, user.get('hash'));
}

const UserModel = model('user', UserSchema);

export default UserModel;