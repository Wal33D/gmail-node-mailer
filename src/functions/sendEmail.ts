/**
 * Constructs and sends an email through the Gmail API, accommodating optional HTML content and file attachments.
 * This lower-level function is designed to be called by the `sendEmail` function, which performs initial validations 
 * and setups. It dynamically constructs a MIME (Multipurpose Internet Mail Extensions) message, adjusting the 
 * structure based on the presence of HTML content and attachments to ensure compatibility with various email client standards.
 *
 * The function supports both plain text and HTML emails, and can manage multiple attachments. It handles the encoding 
 * for subjects and the email body to support a wide range of characters beyond basic ASCII, including UTF-8 characters.
 *
 * ### Function Parameters:
 * - `gmailClient` (gmail_v1.Gmail): The authenticated Gmail client instance from the Google API library. This client
 *   is used to send the email.
 * - `params` (ISendEmailParams): Object containing all necessary data for sending an email:
 *   - `senderEmail` (string): The email address of the sender.
 *   - `recipientEmail` (string): The email address of the recipient.
 *   - `subject` (string): The subject of the email. Defaults to an empty string if not provided.
 *   - `message` (string): The main content of the email, can be plain text or HTML.
 *   - `attachments` (IAttachment[]): Optional array of attachment objects, each containing a `filename`, `mimeType`,
 *     and `content` encoded in base64.
 *
 * ### Return Value:
 * Returns a Promise that resolves to an `ISendEmailFunctionResponse` object, which includes:
 * - `sent` (boolean): Indicates whether the email was successfully sent.
 * - `message` (string): A message describing the result of the send operation, useful for logging and user feedback.
 * - `gmailResponse` (any): The raw response from the Gmail API, providing detailed success or error information.
 *
 * ### Errors:
 * The function captures and handles errors internally, focusing on encoding issues or API failures. It returns a 
 * structured error response in case of failure.
 *
 * ### Example Usage:
 * ```javascript
 * const emailParams = {
 *   senderEmail: 'sender@example.com',
 *   recipientEmail: 'recipient@example.com',
 *   subject: 'Test Email',
 *   message: '<h1>Hello World!</h1>',
 *   attachments: [
 *     { filename: 'test.txt', mimeType: 'text/plain', content: 'Base 64 Encoded File Content, i.e. SGVsbG8gd29ybGQh...' }
 *   ]
 * };
 *
 * const response = await sendEmailFunction(gmailClient, emailParams);
 * console.log(response.message);
 * ```
 *
 * This function is a critical component of an email sending pipeline, designed for robust and flexible email generation,
 * suitable for a variety of scenarios from simple notifications to complex newsletters with multiple attachments.
 */

import { gmail_v1 } from 'googleapis';
import { detectHtml } from '../utils/detectHtml';
import { encodeEmailContent } from '../utils/encodeEmailContent';
import { ISendEmailParams, ISendEmailFunctionResponse, EncodingType } from '../types/types';

export async function sendEmailFunction(gmailClient: gmail_v1.Gmail, params: ISendEmailParams): Promise<ISendEmailFunctionResponse> {
    const { senderEmail, senderName, recipientEmail, subject, message, attachments } = params;
    try {
        const { encodedContent: encodedSubject } = encodeEmailContent({ content: subject || '', type: EncodingType.Subject });
        const { isHtml } = detectHtml({ content: message });

        let boundary = "----=_NextPart_" + Math.random().toString(36).substr(2, 9);
        // Conditionally add senderName to the From header
        let mimeMessage = `From: ${senderName ? `"${senderName}" <${senderEmail}>` : senderEmail}\r\nTo: ${recipientEmail}\r\nSubject: ${encodedSubject}\r\n`;

        // Define the top level MIME type
        mimeMessage += `Content-Type: ${attachments && attachments.length > 0 ? "multipart/mixed" : "multipart/alternative"}; boundary=${boundary}\r\n\r\n`;

        // Add the main message part (HTML or plain text)
        if (isHtml) {
            mimeMessage += `--${boundary}\r\n` +
                `Content-Type: text/html; charset=UTF-8\r\n\r\n` +
                `${message}\r\n`;
        } else {
            mimeMessage += `--${boundary}\r\n` +
                `Content-Type: text/plain; charset=UTF-8\r\n\r\n` +
                `${message}\r\n`;
        }

        // Add each attachment
        if (attachments && attachments.length > 0) {
            attachments.forEach(attachment => {
                mimeMessage += `--${boundary}\r\n` +
                    `Content-Type: ${attachment.mimeType}; name="${attachment.filename}"\r\n` +
                    `Content-Disposition: attachment; filename="${attachment.filename}"\r\n` +
                    `Content-Transfer-Encoding: base64\r\n\r\n` +
                    `${attachment.content}\r\n`;
            });
        }

        // Close the MIME message
        mimeMessage += `--${boundary}--`;

        const { encodedContent, isEncoded } = encodeEmailContent({ content: mimeMessage, type: EncodingType.MimeMessage });

        if (!isEncoded || !encodedContent) {
            throw new Error('Failed to encode MIME message.');
        }

        const gmailResponse = await gmailClient.users.messages.send({
            userId: 'me',
            requestBody: { raw: encodedContent },
        });

        return {
            sent: gmailResponse.status >= 200 && gmailResponse.status < 300,
            message: gmailResponse.status >= 200 && gmailResponse.status < 300 ?
                `Email successfully sent to ${recipientEmail}.` :
                `Failed to send email. Status: ${gmailResponse.status}`,
            gmailResponse: gmailResponse,
        };

    } catch (error: any) {
        return { sent: false, message: `An error occurred while sending the email: ${error.message}`, gmailResponse: null };
    }
}
