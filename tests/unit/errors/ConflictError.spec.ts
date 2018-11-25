import { ConflictError } from '../../../src/errors';

describe('ConflictError', () => {
  it('should have its message set to "conflict"', () => {
    expect(new ConflictError().message).toEqual('conflict');
  });
  it('should be an error instance', () => {
    expect(new ConflictError() instanceof Error).toBe(true);
  });
  it('should return 409 when no error code is passed', () => {
    expect(new ConflictError().status).toBe(409);
  });
  it('should return a custom error code when passed', () => {
    expect(new ConflictError('message', 408).status).toBe(408);
  });
  it('should return the custom error message', () => {
    expect(new ConflictError('test message').message).toBe('test message');
  });
});
