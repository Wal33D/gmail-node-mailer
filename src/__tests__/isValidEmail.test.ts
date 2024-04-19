import { validateEmailAddress } from '../utils/validateEmailAddress';

describe('validateEmailAddress', () => {
  test('should return true for a valid email', () => {
    expect(validateEmailAddress({email:'test@example.com'}).result).toBe(true);
  });

  test('should return false for an invalid email', () => {
    expect(validateEmailAddress({email:'testexample.com'}).result).toBe(false);
  });
});
