/**
 * Encodes the email subject line using MIME encoded-word syntax with UTF-8 and Base64 encoding.
 * @param {string} subjectLine - The email subject line to be encoded.
 * @returns {Object} An object containing `isEncoded`, indicating whether the encoding was successful, and `encodedSubject`, the MIME encoded subject line.
 */
export const encodeEmailSubject = ({ subjectLine }: { subjectLine: string }): { isEncoded: boolean; encodedSubject: string } => {
    let isEncoded = false;
    let encodedSubject: string = subjectLine; // Default to the original subject line in case encoding fails

    try {
        encodedSubject = `=?utf-8?B?${Buffer.from(subjectLine, 'utf-8').toString('base64')}?=`;
        isEncoded = true; // Indicate successful encoding
    } catch (error: any) {
        console.error("Error encoding email subject:", error.message);
        // The encodedSubject remains the original subjectLine if an error occurs
    }

    return { isEncoded, encodedSubject };
};
