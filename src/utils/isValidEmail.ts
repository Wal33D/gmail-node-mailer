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
export function isValidEmail({ email }: { email: string }): { status: boolean, result: boolean | null } {
    let status = false;
    let result: boolean | null = null;
    try {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        result = emailRegex.test(email);
        status = true; // Operation succeeded
    } catch (error: any) {
        console.error("Error validating email:", error.message);
        result = false; // Explicitly setting result to false in case of error
    }
    return { status, result };
}
