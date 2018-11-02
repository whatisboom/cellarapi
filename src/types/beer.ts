import { IBrewery } from './index';

export interface IBeer {
  _id: any;
  name?: string;
  abv?: number;
  style?: string;
  brewery?: string | IBrewery;
  createdAt?: Date;
  updatedAt?: Date;
}
