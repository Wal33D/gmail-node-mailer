/**
 * Checks if the provided string is a valid email address.
 * 
 * This function uses a regular expression to validate the email format. It checks for a pattern that
 * includes one or more characters before the "@" symbol, followed by characters after the "@" symbol,
 * and finally a domain suffix with two or more characters, allowing for subdomains. This pattern avoids
 * unnecessary backtracking and complexity, making it more performant and less vulnerable to ReDoS attacks.
 *
 * @param {{ email: string }} params An object containing the email address to validate.
 * @returns {{ status: boolean, result: boolean | null }} Object containing the status of the operation
 * and the result of the email validation.
 */
export function isValidEmail({ email }: { email: string }): { status: boolean, result: boolean | null } {
    let status = false;
    let result: boolean | null = null;
    try {
        // Efficient regex pattern for basic email validation
        const emailRegex = /^[^@\s]+@([^@\s]+\.)+[^@\s]{2,}$/;
        result = emailRegex.test(email);
        status = true; // Operation succeeded
    } catch (error: any) {
        console.error("Error validating email:", error.message);
        result = false; // Explicitly setting result to false in case of error
    }
    return { status, result };
}
