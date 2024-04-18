import { gmail_v1 } from 'googleapis';
import { isHtmlMessage } from '../utils/isHtmlMessage';
import { encodeEmailSubject } from '../utils/encodeSubject';
import { encodeMimeMessageToBase64Url } from '../utils/encodeMimeMessageToBase64Url';
import { ISendEmailParams, ISendEmailFunctionResponse } from '../types';

export async function sendEmailFunction(gmailClient: gmail_v1.Gmail, { senderEmail, recipientEmail, subject, message, attachments }: ISendEmailParams): Promise<ISendEmailFunctionResponse> {
    try {
        const { encodedSubject } = encodeEmailSubject({ subjectLine: subject });
        const { status: isHtml } = isHtmlMessage({ message });

        let boundary = "----=_NextPart_" + Math.random().toString(36).substr(2, 9);
        let mimeMessage = `From: ${senderEmail}\r\nTo: ${recipientEmail}\r\nSubject: ${encodedSubject}\r\n`;

        // Determine MIME type based on whether there are attachments
        mimeMessage += attachments && attachments.length > 0
            ? `Content-Type: multipart/mixed; boundary=${boundary}\r\n\r\n`
            : `Content-Type: multipart/alternative; boundary=${boundary}\r\n\r\n`;

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
        if (attachments) {
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
