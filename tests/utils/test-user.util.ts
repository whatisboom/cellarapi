import * as rand from 'rand-token';

const hash = rand.generate(16);

export const test_user = {
  _id: 'abcdefghijklmnopqrstuvwx',
  username: `test_user${hash}`,
  password: 'test_password',
  email: `test${hash}@email.com`,
  role: 'admin'
};
