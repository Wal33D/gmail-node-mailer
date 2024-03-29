/**
 * Checks if a message contains HTML content.
 * 
 * @param {object} options - The options object.
 * @param {string} options.message - The message to check.
 * @returns {object} - An object containing the status and result of the check.
 * @property {boolean} status - Indicates whether the check was successful.
 * @property {boolean | null} result - The result of the check. Returns `true` if the message contains HTML content, `false` if it does not, or `null` if an error occurred during the check.
 */
export const isHtmlMessage = ({ message }: { message: string }) => {
    let status = false;
    let result: boolean | null = null;
    
    try {
        // More efficient regex pattern to check for the presence of HTML tags
        // This pattern aims to reduce backtracking by limiting the extent of wildcard matching
        // and focusing on the structure of HTML tags
        const htmlTagRegex = /<\/?[a-z]+(\s+[a-z-]+(?:="[^"]*")?)*\s*\/?>/i;
        result = htmlTagRegex.test(message);
        status = true;
    } catch (error: any) {
        console.error("Error checking for HTML content:", error.message);
        result = null;
    }
    return { status, result };
};
