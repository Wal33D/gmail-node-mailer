import { isValidEmail } from '../utils/isValidEmail';

describe('isValidEmail', () => {
  test('should return true for a valid email', () => {
    expect(isValidEmail({email:'test@example.com'}).result).toBe(true);
  });

  test('should return false for an invalid email', () => {
    expect(isValidEmail({email:'testexample.com'}).result).toBe(false);
  });
});
