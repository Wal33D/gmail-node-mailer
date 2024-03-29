/**
 * Encodes a MIME email message string into a base64, URL-safe format.
 * If encoding fails, the function returns the original email input, indicating failure.
 * 
 * @param {string} mimeMessage The MIME message to encode.
 * @returns {Object} An object containing a flag indicating encoding success and the encoded content or original message.
 */
export const encodeMimeMessageToBase64Url = ({ mimeMessage }: { mimeMessage: string }): { isEncoded: boolean; encodedContent: string | null; } => {
    let isEncoded = false;
    let encodedContent: string | null = null;

    try {
        // Encoding logic to base64 URL-safe format
        encodedContent = Buffer.from(mimeMessage, 'utf-8').toString('base64').replace(/\+/g, '-').replace(/\//g, '_');
        isEncoded = true; // Mark as successfully encoded
    } catch (error) {
        console.error('Encoding MIME message failed:', error);
        // Retain original message in case of encoding failure
        encodedContent = mimeMessage;
    }

    // Single return statement with updated naming for clarity
    return { isEncoded, encodedContent };
};
