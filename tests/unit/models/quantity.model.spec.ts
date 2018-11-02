import { IQuantityModel, OwnedModel } from '../../../src/models/quantity.model';

describe('OwnedModel', () => {
  it('should throw errors for missing amount, beer, userId', async done => {
    try {
      const ownedBeer: IQuantityModel = new OwnedModel();
      await ownedBeer.validate();
    } catch (e) {
      expect(e).toHaveProperty('errors');
      expect(e.errors).toHaveProperty('amount');
      expect(e.errors).toHaveProperty('beer');
      expect(e.errors).toHaveProperty('userId');
    } finally {
      done();
    }
  });

  it('should create successfully when passed all attributes', () => {
    try {
      const ownedBeer: IQuantityModel = new OwnedModel({
        beer: '1',
        userId: '1',
        amount: 10
      });
      expect(ownedBeer).toBeDefined();
    } catch (e) {}
  });

  it('should update properly', () => {
    OwnedModel.findOneAndUpdate(
      {
        name: 'Test Beer'
      },
      {
        amount: 1
      },
      (ownedBeer: IQuantityModel) => {
        expect(ownedBeer).toBeDefined();
        expect(ownedBeer.get('amount')).toEqual(1);
      }
    );
  });
});
