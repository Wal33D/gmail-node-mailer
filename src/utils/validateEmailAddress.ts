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
export function validateEmailAddress({ email }: { email: string }): { status: boolean; result: boolean | null }{
    let status = true;
    let result: boolean | null = null;
    try {
        // This pattern is designed to reduce complexity and minimize the risk of exponential backtracking
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
        result = emailRegex.test(email);
    } catch (error: any) {
        console.error("Error validating email:", error.message);
        result = false; // Explicitly setting result to false in case of error
    }
    return { status, result };
}
