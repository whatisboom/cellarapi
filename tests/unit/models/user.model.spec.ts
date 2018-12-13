import UserModel, { IUserModel } from '../../../src/models/user.model';
import * as bcrypt from 'bcryptjs';

describe('UserModel', () => {
  it('should throw an error when username is missing', async (done) => {
    try {
      const user: IUserModel = new UserModel();
      await user.validate();
    } catch (e) {
      expect(e).toHaveProperty('errors');
      expect(Object.keys(e.errors).length).toEqual(2);
      expect(e.errors.email).toBeDefined();
      expect(e.errors.username).toBeDefined();
    } finally {
      done();
    }
  });

  it('should create successfully when passed username and email', () => {
    try {
      const user: IUserModel = new UserModel({
        username: 'test_user',
        email: 'test@email.com'
      });
      expect(user).toBeDefined();
      expect(user.get('username')).toEqual('test_user');
      expect(user.get('createdAt')).toBeDefined();
      expect(user.get('updatedAt')).toBeUndefined();
    } catch (e) {}
  });

  it('should update properly', () => {
    UserModel.findOneAndUpdate(
      {
        username: 'test_user'
      },
      {
        firstName: 'Testy',
        lastName: 'McTesterson'
      },
      (user: IUserModel) => {
        expect(user.get('firstName')).toEqual('Testy');
        expect(user.get('lastName')).toEqual('McTesterson');
        expect(user.get('updatedAt')).toBeDefined();
      }
    );
  });

  it('should validate role properly', async (done) => {
    try {
      const user: IUserModel = await UserModel.create({
        email: 'test@email.com',
        username: 'test_user',
        role: 'wizard'
      });
    } catch (e) {
      expect(e).toHaveProperty('errors');
      expect(e.errors).toHaveProperty('role');
      expect(e.errors.role.name).toEqual('ValidatorError');
      expect(e.errors.role.message).toEqual(
        '`wizard` is not a valid enum value for path `role`.'
      );
    } finally {
      done();
    }
  });
});
