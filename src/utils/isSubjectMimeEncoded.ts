/**
 * Checks if the subject of an email is MIME encoded.
 *
 * This function uses a regular expression to check for the encoded-word syntax as defined in RFC 2047.
 * It matches '=?' followed by the charset, encoding ('B' for Base64 or 'Q' for Quoted-Printable), then
 * the encoded text itself, and finally '?='. The encoded text is matched in a non-greedy way to prevent
 * excessive backtracking.
 *
 * @param {Object} options - The options object.
 * @param {string} options.subject - The subject of the email.
 * @returns {Object} - The result object.
 * @property {boolean} status - The status of the operation.
 * @property {boolean | null} result - The result of the MIME encoding check.
 */
export const isSubjectMimeEncoded = ({ subject }: { subject: string }) => {
    let status = false;
    let result: boolean | null = null;

    try {
        // Specific regex pattern for matching MIME encoded-words in the subject
        const mimeEncodedPattern = /=\?utf-8\?(B|Q)\?[^\?]*\?=/i;
        result = mimeEncodedPattern.test(subject);
        status = true;
    } catch (error: any) {
        console.error("Error checking MIME encoding:", error.message);
        result = null;
    }
    
    return { status, result };
};
