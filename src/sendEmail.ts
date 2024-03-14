// ./src/sendEmail.ts
import { ISendEmailResponse } from './types';

export async function sendEmail({
  senderEmail = process.env.GMAIL_USER as string,
  recipientEmail,
  subject,
  message,
}: {
  senderEmail: string;
  recipientEmail: string;
  subject: string;
  message: string;
}): Promise<ISendEmailResponse> {
  const rawEmail = Buffer.from(
    `From: ${senderEmail}\r\n` +
      `To: ${recipientEmail}\r\n` +
      `Subject: ${subject}\r\n\r\n` +
      `${message}`,
  )
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  try {
    //@ts-ignore
    const response = await global.gmailClient.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: rawEmail,
      },
    });

    const isSuccess = response.status >= 200 && response.status < 300;

    return {
      sent: isSuccess,
      status: response.status,
      message: isSuccess ? response.statusText : 'Unknown Error',
    };
  } catch (error: any) {
    return {
      sent: false,
      status: error.response?.status,
      message: error.response?.statusText || error.message,
    };
  }
}
