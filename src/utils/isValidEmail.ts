/**
 * Checks if the provided string is a valid email address.
 * 
 * This function uses a regular expression to validate the email format. It checks for a general
 * pattern that includes characters before the "@" symbol, followed by characters after it,
 * and finally a domain suffix. This is a basic validation and might not cover all edge cases
 * of email address validation according to the RFC specifications.
 *
 * @param {string} email The email address to validate.
 * @returns {boolean} True if the email address is valid, false otherwise.
 */
export function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
