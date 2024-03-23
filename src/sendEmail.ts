import { gmail_v1 } from 'googleapis';
import { ISendEmailParams, ISendEmailResponse } from './types';

export async function sendEmail(
    gmailClient: gmail_v1.Gmail | null,
    { senderEmail, recipientEmail, subject, message }: ISendEmailParams
): Promise<ISendEmailResponse> {
    if (!gmailClient) {
        throw new Error('Gmail client is not initialized. Call initializeClient first.');
    }

    const rawEmail = Buffer.from(
        `From: ${senderEmail}\r\n` +
        `To: ${recipientEmail}\r\n` +
        `Subject: ${subject}\r\n\r\n` +
        `${message}`
    )
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');

    try {
        const response = await gmailClient.users.messages.send({
            userId: 'me',
            requestBody: { raw: rawEmail },
        });

        const isSuccess = response.status >= 200 && response.status < 300;

        if (!isSuccess) { Error('Unknown Error') }

        return {
            status: true,
            message: `Email successfully sent to ${recipientEmail}`,
        };
    } catch (error: any) {
        return {
            status: false,
            message: error.response?.statusText || error.message,
        };
    }
}