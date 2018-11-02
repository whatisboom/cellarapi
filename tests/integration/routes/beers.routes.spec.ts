import api from '../../../src/api';
import * as supertest from 'supertest';
import { getValidJwt } from '../../utils';
import { IBeerModel } from '../../../src/models/beer.model';

let jwt: string = getValidJwt();

const test_beer: IBeerModel = <IBeerModel>{
  name: 'Test Beer',
  abv: 5,
  style: 'Test Style'
};

describe('Beer Routes', () => {
  describe('POST /beers', () => {
    it('should create a beer', done => {
      supertest(api)
        .post('/beers')
        .send(test_beer)
        .set('Authorization', `Bearer ${jwt}`)
        .set('Content-Type', 'application/json')
        .expect(200)
        .end((err: Error, response: supertest.Response) => {
          if (err) done(err);
          expect(response.body).toHaveProperty('beer');
          expect(response.body.beer.name).toEqual(test_beer.name);
          test_beer._id = response.body.beer._id;
          done();
        });
    });
  });

  describe('GET /beers', () => {
    it('should get a list of beers', done => {
      supertest(api)
        .get('/beers')
        .set('Authorization', `Bearer ${jwt}`)
        .expect(200)
        .end((err: Error, response: supertest.Response) => {
          if (err) done(err);
          expect(response.body).toHaveProperty('beers');
          expect(response.body.beers.length).toBeGreaterThan(0);
          done();
        });
    });
  });

  describe('GET /beers/:beerId', () => {
    it('should return a single beer', done => {
      supertest(api)
        .get(`/beers/${test_beer._id}`)
        .set('Authorization', `Bearer ${jwt}`)
        .expect(200)
        .end((err: Error, response: supertest.Response) => {
          if (err) done(err);
          expect(response.body).toHaveProperty('beer');
          expect(response.body.beer.name).toEqual(test_beer.name);
          done();
        });
    });

    it('should 404 on unknown :beerId', done => {
      supertest(api)
        .get(`/beers/1234`)
        .set('Authorization', `Bearer ${jwt}`)
        .expect(404)
        .end((err: Error, response: supertest.Response) => {
          if (err) done(err);
          expect(response.body).toHaveProperty('error');
          done();
        });
    });
  });

  describe('PUT /beers/:beerId', () => {
    it('should update the beer', done => {
      supertest(api)
        .put(`/beers/${test_beer._id}`)
        .set('Authorization', `Bearer ${jwt}`)
        .send({
          name: 'NEW NAME'
        })
        .expect(200)
        .end((err: Error, response: supertest.Response) => {
          if (err) done(err);
          expect(response.body).toHaveProperty('beer');
          expect(response.body.beer.name).toEqual('NEW NAME');
          done();
        });
    });
    it('should 404 on unknown :beerId', done => {
      supertest(api)
        .put(`/beers/1234`)
        .set('Authorization', `Bearer ${jwt}`)
        .send({
          name: 'NEW NAME'
        })
        .expect(404)
        .end((err: Error, response: supertest.Response) => {
          if (err) done(err);
          expect(response.body).toHaveProperty('error');
          done();
        });
    });
  });

  describe('DELETE /beers/:beerId', () => {
    it('should successfully remove the beer', done => {
      supertest(api)
        .delete(`/beers/${test_beer._id}`)
        .set('Authorization', `Bearer ${jwt}`)
        .expect(204)
        .end((err: Error, response: supertest.Response) => {
          if (err) done(err);
          done();
        });
    });
  });
  it('should 404 on unknown :beerId', done => {
    supertest(api)
      .delete(`/beers/1234`)
      .set('Authorization', `Bearer ${jwt}`)
      .expect(404)
      .end((err: Error, response: supertest.Response) => {
        if (err) done(err);
        expect(response.body).toHaveProperty('error');
        done();
      });
  });
});
