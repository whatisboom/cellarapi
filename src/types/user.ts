import { IBeer } from './index';

export interface IUser {
  _id: any;
  username: string;
  email: string;
  role?: string;
  firstName?: string;
  lastName?: string;
  beers?: Array<string | IBeer>;
  updatedAt?: Date;
  oauth?: {
    untappd: string;
  };
  untappdApiKey?: string;
}
