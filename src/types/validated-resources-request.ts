import { Request } from 'express';
import { IBeerModel } from '../models/beer.model';
import { IUserModel } from '../models/user.model';
import { IBreweryModel } from '../models/brewery.model';
import { IQuantityModel } from '../models/quantity.model';

export interface ValidatedResourcesRequest extends Request {
  resources: {
    [key: string]: IBeerModel | IBreweryModel | IUserModel | IQuantityModel;
    beer?: IBeerModel;
    brewery?: IBreweryModel;
    user?: IUserModel;
    owned?: IQuantityModel;
  };
}
