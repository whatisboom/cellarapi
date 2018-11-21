import { Request } from 'express';
import { IBeer, IBrewery, IUser } from '../types';

export interface IValidResource extends IBeer, IBrewery, IUser {}

export interface ValidatedResourcesRequest extends Request {
  resources: {
    [key: string]: IValidResource;
  };
}
