import UserModel, { IUserModel } from '../../../src/models/user.model';
import * as bcrypt from 'bcryptjs';

describe('UserModel', () => {
  it('should throw an error when username is missing', async done => {
    try {
      const user: IUserModel = new UserModel();
      await user.validate();
    } catch (e) {
      expect(e.errors).toBeDefined();
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

  describe('schema', () => {
    it('should be defined', () => {
      expect(UserModel.schema).toBeDefined();
    });
    describe('methods', () => {
      it('should be defined', () => {
        expect(UserModel.schema.methods).toBeDefined();
      });

      describe('getPasswordHash()', () => {
        const { getPasswordHash } = UserModel.schema.methods;
        it('should be defined', () => {
          expect(getPasswordHash).toBeDefined();
        });
        it('should return a string', () => {
          spyOn(bcrypt, 'hashSync').and.returnValue('asd');
          expect(typeof getPasswordHash('test_password', 'test_salt')).toBe(
            'string'
          );
        });
      });

      describe('isPasswordValid()', () => {
        const { isPasswordValid } = UserModel.schema.methods;
        it('should be defined', () => {
          expect(isPasswordValid).toBeDefined();
        });
        it('should return a boolean', () => {
          expect(
            isPasswordValid('test_password', {
              get() {
                return 'hash';
              }
            })
          ).toBe(false);
        });
      });
    });
  });
});
