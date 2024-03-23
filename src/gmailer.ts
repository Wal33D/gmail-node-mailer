import { google, gmail_v1 } from 'googleapis';

import { sendEmail } from './sendEmail'; 
import { isValidEmail } from './utils/isValidEmail';
import { parseServiceAccountFile } from './utils/parseServiceAccountFile';

import {
    IInitializeClientParams,
    IInitializeClientResult, ISendEmailParams,
    ISendEmailResponse
} from './types';

export class GmailMailer {
    private gmailClient: gmail_v1.Gmail | null = null;

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
                serviceAccountResult = await parseServiceAccountFile({ filePath: gmailServiceAccountPath });
                if (!serviceAccountResult.status || !serviceAccountResult.serviceAccount) {
                    throw new Error(serviceAccountResult.message);
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

    async sendEmailWrapper(params: ISendEmailParams): Promise<ISendEmailResponse> {
        if (!this.gmailClient) {
            return {
                sent: false,
                status: 500,
                message: 'Gmail client is not initialized. Call initializeClient first.'
            };
        }
        return sendEmail(this.gmailClient, params);
    }
}
