import { kabobify } from '../../../src/utils';
const input = 'Some String That Needs KaBOBifIcation';
const output = 'some-string-that-needs-kabobification';
describe('kabobify', () => {
  it('should be defined', () => {
    expect(kabobify).toBeDefined();
  });
  it('should return a string', () => {
    expect(typeof kabobify()).toBe('string');
    expect(typeof kabobify(input)).toBe('string');
  });
  it('should return a string without spaces', () => {
    expect(kabobify(input)).toEqual(output);
  });
});
