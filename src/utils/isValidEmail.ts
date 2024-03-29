/**
 * Checks if the provided string is a valid email address.
 * 
 * This function uses a regular expression to validate the email format. It checks for a general
 * pattern that includes characters before the "@" symbol, followed by characters after it,
 * and finally a domain suffix. This is a basic validation and might not cover all edge cases
 * of email address validation according to the RFC specifications.
 *
 * @param {{ email: string }} params An object containing the email address to validate.
 * @returns {{ status: boolean, result: boolean | null }} Object containing the status of the operation
 * and the result of the email validation.
 */
import validator from 'validator';

export function isValidEmail({ email }: { email: string }): { status: boolean, result: boolean } {
    let status = false;
    let result: boolean = false;
    try {
        result = validator.isEmail(email);
        status = true; // Operation succeeded
    } catch (error: any) {
        console.error("Error validating email:", error.message);
    }
    return { status, result };
}
