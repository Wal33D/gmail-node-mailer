import { google, gmail_v1 } from 'googleapis';
import { sendEmail } from './sendEmail';
import { isValidEmail } from './utils/isValidEmail';
import { parseServiceAccountFile } from './utils/parseServiceAccountFile';
import { emailConfig } from './utils/emailConfig';
import { gmailServiceAccountConfig } from './utils/gmailServiceAccountConfig'; // Import the new config
import {
    IGmailServiceAccount,
    IInitializeClientParams,
    IInitializeClientResult, ISendEmailParams,
    ISendEmailResponse
} from './types';

export class GmailMailer {
    private gmailClient: gmail_v1.Gmail | null = null;

    async initializeClient({
        gmailServiceAccount = gmailServiceAccountConfig.get_SERVICE_ACCOUNT() as IGmailServiceAccount,
        gmailServiceAccountPath = gmailServiceAccountConfig.get_SERVICE_ACCOUNT_PATH(),
        gmailSenderEmail = emailConfig.GMAIL_SENDER_EMAIL,
    }: IInitializeClientParams): Promise<IInitializeClientResult> {
        try {
            if (!gmailSenderEmail || !isValidEmail(gmailSenderEmail)) {
                throw new Error("Invalid or missing Gmail sender's email.");
            }

            if (!gmailServiceAccount && gmailServiceAccountPath) {
                const serviceAccountResult = await parseServiceAccountFile({ filePath: gmailServiceAccountPath });
                if (!serviceAccountResult.status || !serviceAccountResult.serviceAccount) {
                    throw new Error(serviceAccountResult.message);
                }
                // Use the setter method to update the service account in the config
                gmailServiceAccountConfig.set_SERVICE_ACCOUNT(serviceAccountResult.serviceAccount);
                gmailServiceAccount = serviceAccountResult.serviceAccount;
            }

            if (!gmailServiceAccount) {
                throw new Error("Gmail service account configuration is missing.");
            }

            // Update the email config using its setter
            emailConfig.GMAIL_SENDER_EMAIL = gmailSenderEmail;

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
                status: false,
                message: 'Gmail client is not initialized. Call initializeClient first.'
            };
        }
        return sendEmail(this.gmailClient, params);
    }
}
