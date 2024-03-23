import { google, gmail_v1 } from 'googleapis';
import { sendEmail } from './sendEmail';
import { isValidEmail } from './utils/isValidEmail';
import { parseServiceAccountFile } from './utils/parseServiceAccountFile';
import { emailConfig } from './utils/emailConfig';
import { gmailServiceAccountConfig } from './utils/gmailServiceAccountConfig';
import {
    IInitializeClientParams,
    IInitializeClientResult, ISendEmailParams,
    ISendEmailResponse
} from './types';

export class GmailMailer {
    private gmailClient: gmail_v1.Gmail | null = null;

    /**
     * Initializes the Gmail API client with the provided configuration.
     * @param {IInitializeClientParams} config - Configuration parameters for initializing the client.
     * @returns {Promise<IInitializeClientResult>} - The result of the initialization attempt.
     */
    async initializeClient({
        gmailServiceAccount = gmailServiceAccountConfig.getServiceAccount(),
        gmailServiceAccountPath = gmailServiceAccountConfig.getServiceAccountPath(),
        gmailSenderEmail = emailConfig.getGmailSenderEmail(),
    }: IInitializeClientParams): Promise<IInitializeClientResult> {
        try {
            if (!gmailSenderEmail || !isValidEmail(gmailSenderEmail)) {
                throw new Error("The provided Gmail sender's email is invalid or missing.");
            }

            // Load the service account from file if necessary.
            if (!gmailServiceAccount && gmailServiceAccountPath) {
                const serviceAccountResult = await parseServiceAccountFile({ filePath: gmailServiceAccountPath });
                if (!serviceAccountResult.status || !serviceAccountResult.serviceAccount) {
                    throw new Error(`Failed to load service account: ${serviceAccountResult.message}`);
                }
                gmailServiceAccountConfig.setServiceAccount(serviceAccountResult.serviceAccount);
                gmailServiceAccount = serviceAccountResult.serviceAccount;
            }

            if (!gmailServiceAccount) {
                throw new Error("Service account configuration is missing.");
            }

            emailConfig.setGmailSenderEmail(gmailSenderEmail);

            // Initialize the JWT client for Gmail API.
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
                message: "Gmail API client was initialized successfully."
            };
        } catch (error: any) {
            return {
                status: false,
                gmailClient: null,
                message: `Initialization error: ${error.message}`
            };
        }
    }

    /**
     * Wraps the sendEmail function, ensuring the Gmail client is initialized.
     * @param {ISendEmailParams} params - Parameters for sending the email.
     * @returns {Promise<ISendEmailResponse>} - The result of the email sending attempt.
     */
    async sendEmailWrapper(params: ISendEmailParams): Promise<ISendEmailResponse> {
        if (!this.gmailClient) {
            return {
                status: false,
                message: 'The Gmail client has not been initialized. Please call initializeClient first.'
            };
        }
        return sendEmail(this.gmailClient, params);
    }
}
