import BeerModel, { IBeerModel } from '../../../src/models/beer.model';

describe('BeerModel', () => {
  it('should throw an error when name is missing', async done => {
    try {
      const user: IBeerModel = new BeerModel();
      await user.validate();
    } catch (e) {
      expect(e).toHaveProperty('errors');
      expect(Object.keys(e.errors).length).toEqual(1);
      expect(e.errors.name.message).toEqual('Path `name` is required.');
      expect(e.errors.name.kind).toEqual('required');
    } finally {
      done();
    }
  });

  it('should create successfully when passed name', () => {
    try {
      const user: IBeerModel = new BeerModel({
        name: 'Test Beer'
      });
      expect(user).toBeDefined();
      expect(user.get('name')).toEqual('Test Beer');
      expect(user.get('createdAt')).toBeDefined();
      expect(user.get('updatedAt')).toBeUndefined();
    } catch (e) {}
  });

  it('should create successfully when passed all attributes', () => {
    try {
      const user: IBeerModel = new BeerModel({
        name: 'Test Beer',
        abv: 7.1,
        style: 'Glitter IPA',
        brewery: 'some_guid'
      });
      expect(user).toBeDefined();
      expect(user.get('name')).toEqual('Test Beer');
      expect(user.get('abv')).toEqual(7.1);
      expect(user.get('style')).toEqual('Glitter IPA');
      expect(user.get('brewery')).toEqual('some_guid');
      expect(user.get('createdAt')).toBeDefined();
      expect(user.get('updatedAt')).toBeUndefined();
    } catch (e) {}
  });

  it('should update properly', () => {
    BeerModel.findOneAndUpdate(
      {
        name: 'Test Beer'
      },
      {
        name: 'Test Beer!'
      },
      (user: IBeerModel) => {
        expect(user.get('name')).toEqual('Test Beer!');
        expect(user.get('updatedAt')).toBeDefined();
      }
    );
  });

  describe('schema', () => {
    it('should be defined', () => {
      expect(BeerModel.schema).toBeDefined();
    });
  });
});
