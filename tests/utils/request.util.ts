import api from '../../src/api';
import * as supertest from 'supertest';
import { getValidJwt } from './index';
const defaults: any = require('superagent-defaults');

export function request(user?: any) {
  const jwt = getValidJwt(user);
  const req = defaults(supertest(api));
  req.set({
    Authorization: `Bearer ${jwt}`,
    'Content-Type': 'application/json'
  });
  return req;
}
