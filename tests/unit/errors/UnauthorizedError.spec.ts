import { UnauthorizedError } from '../../../src/errors';

describe('UnauthorizedError', () => {
  it('should have its message set to "conflict"', () => {
    expect(new UnauthorizedError().message).toEqual('unauthorized');
  });
});
