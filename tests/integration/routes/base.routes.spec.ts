import api from '../../../src/api';
import * as supertest from 'supertest';

describe('Base Routes', () => {
  describe('GET /', () => {
    it('should return 200', done => {
      supertest(api)
        .get('/')
        .expect(200)
        .end((err: Error, response: supertest.Response) => {
          if (err) done(err);
          done();
        });
    });
  });
});
