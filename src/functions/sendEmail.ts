/**
 * This function sends an email using the Gmail API with optional HTML content and attachments.
 * It constructs a MIME message based on whether there are attachments and whether the message is HTML.
 *
 * @param {gmail_v1.Gmail} gmailClient - The Gmail client used to send the email.
 * @param {ISendEmailParams} params - The email parameters, including sender, recipient, subject, message, and optional attachments.
 * @returns {Promise<ISendEmailFunctionResponse>} - The result of the email sending operation, indicating whether the email was successfully sent and the response from Gmail.
 */

import { gmail_v1 } from 'googleapis';
import { detectHtml } from '../utils/detectHtml';
import { encodeEmailContent } from '../utils/encodeEmailContent';
import { ISendEmailParams, ISendEmailFunctionResponse, EncodingType } from '../types';

export async function sendEmailFunction(gmailClient: gmail_v1.Gmail, { senderEmail, recipientEmail, subject, message, attachments }: ISendEmailParams): Promise<ISendEmailFunctionResponse> {
    try {
        const { encodedContent: encodedSubject } = encodeEmailContent({ content: subject || '', type: EncodingType.Subject });
        const { isHtml } = detectHtml({ content: message });

        let boundary = "----=_NextPart_" + Math.random().toString(36).substr(2, 9);
        let mimeMessage = `From: ${senderEmail}\r\nTo: ${recipientEmail}\r\nSubject: ${encodedSubject}\r\n`;

        // Define the top level MIME type based on whether there are attachments
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