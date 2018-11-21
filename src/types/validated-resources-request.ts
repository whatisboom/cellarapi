import { Request } from 'express';
import { IBeerModel } from '../models/beer.model';
import { IUserModel } from '../models/user.model';
import { IBreweryModel } from '../models/brewery.model';

export interface ValidatedResourcesRequest extends Request {
  resources: {
    [key: string]: IBeerModel | IBreweryModel | IUserModel;
    beer?: IBeerModel;
    brewery?: IBreweryModel;
    user?: IUserModel;
  };
}
