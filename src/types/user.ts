import { IBeer } from './index';

export interface IUser {
  _id: any;
  username?: string;
  email?: string;
  role?: string;
  hash?: string;
  salt?: string;
  firstName?: string;
  lastName?: string;
  beers?: Array<string | IBeer>;
  updatedAt: Date;
}
