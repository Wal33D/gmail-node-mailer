import { gmail_v1 } from 'googleapis';
import { encodeEmailSubject } from '../utils/encodeSubject';
import { isHtmlMessage } from '../utils/isHtmlMessage';
import { encodeMimeMessageToBase64Url } from '../utils/encodeMimeMessageToBase64Url';
import { ISendEmailParams, ISendEmailFunctionResponse } from '../types';

/**
 * Sends an email using the Gmail API client, supporting both HTML and plain text content. It automatically
 * MIME encodes the subject if it isn't already and determines whether the message content is HTML or plain text
 * to format the email appropriately.
 * 
 * @param {gmail_v1.Gmail} gmailClient The Gmail API client instance.
 * @param {ISendEmailParams} params Parameters required for sending the email, including sender, recipient, subject, and message content.
 * @returns {Promise<ISendEmailFunctionResponse>} The result of the email sending operation, including whether the email was sent successfully, the status message, and the raw Gmail API response.
 */
export async function sendEmailFunction(gmailClient: gmail_v1.Gmail, { senderEmail, recipientEmail, subject, message }: ISendEmailParams): Promise<ISendEmailFunctionResponse> {
    try {
        const { encodedSubject } = encodeEmailSubject({ subjectLine: subject });

        // Determine if the message is HTML or plain text
        const { status: isHtml } = isHtmlMessage({ message });

        let mimeMessage = `From: ${senderEmail}\r\nTo: ${recipientEmail}\r\nSubject: ${encodedSubject}\r\n`;
        
        if (isHtml) {
            // Construct MIME message based on HTML check result
            const boundary = "----=_NextPart_" + Math.random().toString(36).substr(2, 9);
            mimeMessage += `Content-Type: multipart/alternative; boundary=${boundary}\r\n\r\n` +
                `--${boundary}\r\n` +
                `Content-Type: text/html; charset=UTF-8\r\n\r\n` +
                `${message}\r\n` +
                `--${boundary}--`;
        } else {
            mimeMessage += `Content-Type: text/plain; charset=UTF-8\r\n\r\n${message}`;
        }

        const { isEncoded, encodedContent } = encodeMimeMessageToBase64Url({ mimeMessage });

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
