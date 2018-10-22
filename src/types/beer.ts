import {
  IBrewery
} from './index';

export interface IBeer{
  _id: string;
  name?: string;
  abv?: number;
  brewery?: Array<string | IBrewery>;
}