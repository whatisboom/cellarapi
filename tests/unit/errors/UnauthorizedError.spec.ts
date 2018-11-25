import { UnauthorizedError } from '../../../src/errors';

describe('UnauthorizedError', () => {
  it('should have its message set to "conflict"', () => {
    expect(new UnauthorizedError().message).toEqual('unauthorized');
  });
  it('should be an error instance', () => {
    expect(new UnauthorizedError() instanceof Error).toBe(true);
  });
  it('should return 409 when no error code is passed', () => {
    expect(new UnauthorizedError().status).toBe(401);
  });
  it('should return a custom error code when passed', () => {
    expect(new UnauthorizedError('message', 408).status).toBe(408);
  });
  it('should return the custom error message', () => {
    expect(new UnauthorizedError('test message').message).toBe('test message');
  });
});
