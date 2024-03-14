// Importing necessary modules
import * as path from 'path';
import { google, gmail_v1 } from 'googleapis';
import { readFileSync } from 'fs';
import { isValidEmail } from './utils/isValidEmail';

export interface ISendEmailResponse {
    sent: boolean;
    status: number;
    message: string;
};

// Interface for the parameters accepted by the initializeClient function remains the same
export interface IInitializeClientParams {
    gmailServiceAccount?: IGmailServiceAccount;
    gmailServiceAccountPath?: string;
    gmailSenderEmail?: string;
}

// Interface for the function's return type remains the same
export interface IInitializeClientResult {
    status: boolean;
    gmailClient: typeof google.gmail_v1.Gmail | null;
    message: string;
}
// Interface for the Gmail service account credentials
export interface IGmailServiceAccount {
    private_key: string;
    client_email: string;
}

export class GmailMailer {
    private gmailClient: gmail_v1.Gmail | null = null;

    async initializeClient({
        gmailServiceAccount = JSON.parse(process.env.GMAIL_SERVICE_ACCOUNT || '{}'),
        gmailServiceAccountPath = process.env.GMAIL_SERVICE_ACCOUNT_PATH,
        gmailSenderEmail = process.env.GMAIL_USER,
    }: IInitializeClientParams): Promise<IInitializeClientResult> {
        try {
            if (!gmailSenderEmail || !isValidEmail(gmailSenderEmail)) {
                throw new Error("Invalid or missing Gmail sender's email.");
            }

            if (!gmailServiceAccount && gmailServiceAccountPath) {
                const absolutePath = path.resolve(gmailServiceAccountPath);
                gmailServiceAccount = JSON.parse(readFileSync(absolutePath, 'utf-8'));
            } else if (!gmailServiceAccount && !gmailServiceAccountPath) {
                throw new Error("Gmail service account data or path to the JSON file must be provided.");
            }

            const jwtClient = new google.auth.JWT(
                gmailServiceAccount.client_email,
                undefined,
                gmailServiceAccount.private_key,
                ['https://www.googleapis.com/auth/gmail.send'],
                gmailSenderEmail,
            );

            await jwtClient.authorize();
            this.gmailClient = google.gmail({ version: 'v1', auth: jwtClient });

            return {
                status: true,
                gmailClient: this.gmailClient,
                message: "Success: Gmail API client initialized successfully."
            };
        } catch (error: any) {
            return {
                status: false,
                gmailClient: null,
                message: `Error: ${error.message}`
            };
        }
    }

    async sendEmail({
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
        if (!this.gmailClient) {
            throw new Error('Gmail client is not initialized. Call initializeClient first.');
        }

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
            const response = await this.gmailClient.users.messages.send({
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
}

