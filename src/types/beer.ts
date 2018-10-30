import { IBrewery } from './index';

export interface IBeer {
  _id: any;
  name?: string;
  abv?: number;
  brewery?: string | IBrewery;
}
