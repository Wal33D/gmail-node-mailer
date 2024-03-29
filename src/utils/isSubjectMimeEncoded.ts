/**
 * Checks if the subject of an email is MIME encoded.
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
        const mimeEncodedPattern = /=\?utf-8\?B\?.*\?=/i;
        result = mimeEncodedPattern.test(subject);
        status = true;
    } catch (error: any) {
        console.error("Error checking MIME encoding:", error.message);
        result = null;
    }
    return { status, result };
};
