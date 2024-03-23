import { gmail_v1 } from 'googleapis';
import { ISendEmailParams, ISendEmailResponse } from './types';

/**
 * Sends an email using the Gmail API client.
 * 
 * @param {gmail_v1.Gmail | null} gmailClient The Gmail API client instance.
 * @param {ISendEmailParams} params Parameters required for sending the email.
 * @returns {Promise<ISendEmailResponse>} The result of the email sending operation.
 */
export async function sendEmail(
    gmailClient: gmail_v1.Gmail | null,
    { senderEmail, recipientEmail, subject, message }: ISendEmailParams
): Promise<ISendEmailResponse> {
    if (!gmailClient) {
        return {
            status: false,
            message: 'The Gmail client has not been initialized. Please call initializeClient first.'
        };
    }

    const encodedEmail = Buffer.from(
        `From: ${senderEmail}\r\n` +
        `To: ${recipientEmail}\r\n` +
        `Subject: ${subject}\r\n\r\n` +
        `${message}`,
        'utf-8'
    ).toString('base64')
     .replace(/\+/g, '-')
     .replace(/\//g, '_');

    try {
        const response = await gmailClient.users.messages.send({
            userId: 'me',
            requestBody: { raw: encodedEmail },
        });

        if (response.status < 200 || response.status >= 300) {
            return {
                status: false,
                message: `Failed to send email. Status: ${response.status}`,
            };
        }

        return {
            status: true,
            message: `Email successfully sent to ${recipientEmail}.`,
        };
    } catch (error: any) {
        return {
            status: false,
            message: `An error occurred while sending the email: ${error.message}`,
        };
    }
}
