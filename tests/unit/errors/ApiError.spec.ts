import { ApiError } from '../../../src/errors';

describe('ApiError', () => {
  it('should be an instance of Error', () => {
    expect(new ApiError() instanceof Error).toBe(true);
  });
  it('should have a default message', () => {
    expect(new ApiError().message).toBe('unknown error');
  });
  it('should have a stack', () => {
    expect(new ApiError().stack).toBeDefined();
  });
  it('should accept custom status codes', () => {
    expect(new ApiError(null, 420).status).toBe(420);
  });
  it('should have custome messages', () => {
    expect(new ApiError('something').message).toBe('something');
  });
});
