import { ConflictError } from '../../../src/errors';

describe('ConflictError', () => {
  it('should have its message set to "conflict"', () => {
    expect(new ConflictError().message).toEqual('conflict');
  });
});
