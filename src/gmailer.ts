// Importing necessary modules
import * as path from 'path';
import { google, gmail_v1 } from 'googleapis';
import { readFileSync } from 'fs';
import { isValidEmail } from './utils/isValidEmail';

import {
    IGmailServiceAccount, IInitializeClientParams,
    IInitializeClientResult, ISendEmailParams,
    ISendEmailResponse
} from './types';

export class GmailMailer {
    private gmailClient: gmail_v1.Gmail | null = null;

    private async parseServiceAccountFile({ filePath }: { filePath: string }): Promise<{ status: boolean; serviceAccount: IGmailServiceAccount | null; message: string; }> {
        try {
            const absolutePath = path.resolve(filePath);
            const fileContents = readFileSync(absolutePath, 'utf-8');
            const parsedAccount: IGmailServiceAccount = JSON.parse(fileContents);

            if (!parsedAccount.private_key || !parsedAccount.client_email) {
                return {
                    status: false,
                    serviceAccount: null,
                    message: "The service account file is missing required fields: 'private_key' or 'client_email'."
                };
            }

            return {
                status: true,
                serviceAccount: parsedAccount,
                message: `Service account for '${parsedAccount.client_email}' loaded successfully.`
            };
        } catch (error: any) {
            return {
                status: false,
                serviceAccount: null,
                message: `Failed to parse service account file: ${error.message}`
            };
        }
    }

    async initializeClient({
        gmailServiceAccount,
        gmailServiceAccountPath,
        gmailSenderEmail = process.env.GMAIL_USER,
    }: IInitializeClientParams): Promise<IInitializeClientResult> {
        try {
            if (!gmailSenderEmail || !isValidEmail(gmailSenderEmail)) {
                throw new Error("Invalid or missing Gmail sender's email.");
            }

            let serviceAccountResult;

            if (!gmailServiceAccount && gmailServiceAccountPath) {
                serviceAccountResult = await this.parseServiceAccountFile({ filePath: gmailServiceAccountPath });
                if (!serviceAccountResult.status || !serviceAccountResult.serviceAccount) {
                    throw new Error("Failed to parse Gmail service account file.");
                }
                gmailServiceAccount = serviceAccountResult.serviceAccount;
            } else if (!gmailServiceAccount && !gmailServiceAccountPath) {
                throw new Error("Gmail service account data or path to the JSON file must be provided.");
            }

            if (!gmailServiceAccount) {
                throw new Error("Gmail service account configuration is missing.");
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
    }: ISendEmailParams): Promise<ISendEmailResponse> {
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

