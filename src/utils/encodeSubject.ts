/**
 * Encodes the subject string using UTF-8 and Base64 encoding.
 * @param subject - The subject string to be encoded.
 * @returns An object containing the encoding status and the encoded result.
 */
export const encodeSubject = ({ subject }: { subject: string }) => {
    let status = false;
    let result: string = subject;

    try {
        result = `=?utf-8?B?${Buffer.from(subject, 'utf-8').toString('base64')}?=`;
        status = true;
    } catch (error: any) {
        console.error("Error encoding subject:", error.message);
        result = subject;
    }

    return { status, result };
};
