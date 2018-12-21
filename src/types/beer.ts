import { IBreweryModel } from '../models/brewery.model';

export interface IBeer {
  _id: any;
  name?: string;
  abv?: number;
  style?: string;
  brewery?: string | IBreweryModel;
  createdAt?: Date;
  updatedAt?: Date;
}
