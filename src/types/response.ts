import { Response } from 'express';

export interface BeerCellarResponse extends Response {
  data: {
    [key: string]: any;
  };
}
