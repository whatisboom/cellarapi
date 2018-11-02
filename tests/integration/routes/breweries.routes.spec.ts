import api from '../../../src/api';
import * as supertest from 'supertest';
import { getValidJwt } from '../../utils';
import { IBreweryModel } from '../../../src/models/brewery.model';

let jwt: string = getValidJwt();

const test_brewery: IBreweryModel = <IBreweryModel>{
  name: 'Test Beerworks',
  city: 'Austin',
  state: 'TX',
  country: 'USA'
};

describe('Brewery Routes', () => {
  describe('POST /breweries', () => {
    it('should create a brewery', done => {
      supertest(api)
        .post('/breweries')
        .send(test_brewery)
        .set('Authorization', `Bearer ${jwt}`)
        .set('Content-Type', 'application/json')
        .expect(200)
        .end((err: Error, response: supertest.Response) => {
          if (err) done(err);
          expect(response.body.brewery.name).toEqual(test_brewery.name);
          test_brewery._id = response.body.brewery._id;
          done();
        });
    });
  });
  describe('GET /breweries', () => {
    it('should return a list of breweries', done => {
      supertest(api)
        .get('/breweries')
        .set('Authorization', `Bearer ${jwt}`)
        .expect(200)
        .end((err: Error, response: supertest.Response) => {
          if (err) done(err);
          expect(response.body).toHaveProperty('breweries');
          expect(response.body.breweries.length).toBeGreaterThan(0);
          done();
        });
    });
  });
  describe('GET /breweries/:breweryId', () => {
    it('should return a single brewery', done => {
      supertest(api)
        .get(`/breweries/${test_brewery._id}`)
        .set('Authorization', `Bearer ${jwt}`)
        .expect(200)
        .end((err: Error, response: supertest.Response) => {
          if (err) done(err);
          expect(response.body).toHaveProperty('brewery');
          expect(response.body.brewery.name).toEqual(test_brewery.name);
          done();
        });
    });
    it('should 404 on unknown :breweryId', done => {
      supertest(api)
        .get(`/breweries/123`)
        .set('Authorization', `Bearer ${jwt}`)
        .expect(404)
        .end((err: Error, response: supertest.Response) => {
          if (err) done(err);
          expect(response.body).toHaveProperty('error');
          done();
        });
    });
  });

  describe('PUT /breweries/:breweryId', () => {
    it('should update the brewery', done => {
      supertest(api)
        .put(`/breweries/${test_brewery._id}`)
        .set('Authorization', `Bearer ${jwt}`)
        .send({
          name: 'NEW NAME'
        })
        .expect(200)
        .end((err: Error, response: supertest.Response) => {
          if (err) done(err);
          expect(response.body).toHaveProperty('brewery');
          expect(response.body.brewery.name).toEqual('NEW NAME');
          done();
        });
    });
    it('should 404 on unknown :breweryId', done => {
      supertest(api)
        .put(`/breweries/123`)
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

  describe('DELETE /breweries/:breweryId', () => {
    it('should successfully remove the brewery', done => {
      supertest(api)
        .delete(`/breweries/${test_brewery._id}`)
        .set('Authorization', `Bearer ${jwt}`)
        .expect(204)
        .end((err: Error, response: supertest.Response) => {
          if (err) done(err);
          done();
        });
    });
    it('should 404 on unknown :breweryId', done => {
      supertest(api)
        .delete(`/breweries/123`)
        .set('Authorization', `Bearer ${jwt}`)
        .expect(404)
        .end((err: Error, response: supertest.Response) => {
          if (err) done(err);
          expect(response.body).toHaveProperty('error');
          done();
        });
    });
  });
});
