import { isValidEmail } from '../utils/isValidEmail';

describe('isValidEmail', () => {
  test('should return true for a valid email', () => {
    expect(isValidEmail('test@example.com')).toBe(true);
  });

  test('should return false for an invalid email', () => {
    expect(isValidEmail('testexample.com')).toBe(false);
  });
});
