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
     * Initializes the Gmail API client using specified configuration parameters.
     * Ensures that a valid service account and Gmail sender email are provided.
     * 
     * @param {IInitializeClientParams} config The configuration parameters for client initialization.
     * @returns {Promise<IInitializeClientResult>} The result of the client initialization attempt.
     */
    async initializeClient({
        gmailServiceAccount = gmailServiceAccountConfig.getServiceAccount(),
        gmailServiceAccountPath = gmailServiceAccountConfig.getServiceAccountPath(),
        gmailSenderEmail = emailConfig.getGmailSenderEmail(),
    }: IInitializeClientParams): Promise<IInitializeClientResult> {
        try {
            if (!gmailSenderEmail || !isValidEmail(gmailSenderEmail)) {
                throw new Error("The Gmail sender's email is invalid or missing.");
            }

            if (!gmailServiceAccount && gmailServiceAccountPath) {
                const serviceAccountResult = await parseServiceAccountFile({ filePath: gmailServiceAccountPath });
                if (!serviceAccountResult.status || !serviceAccountResult.serviceAccount) {
                    throw new Error(serviceAccountResult.message);
                }
                gmailServiceAccountConfig.setServiceAccount(serviceAccountResult.serviceAccount);
            }

            if (!gmailServiceAccount) {
                throw new Error("Service account configuration is required but was not provided.");
            }

            // Update the sender email in the configuration.
            emailConfig.setGmailSenderEmail(gmailSenderEmail);

            // Initialize the JWT client for accessing the Gmail API.
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
                message: "Successfully initialized the Gmail API client."
            };
        } catch (error: any) {
            return {
                status: false,
                gmailClient: null,
                message: `Initialization failed: ${error.message}`
            };
        }
    }

    /**
     * Sends an email using the Gmail API client, ensuring the client is initialized first.
     * 
     * @param {ISendEmailParams} params Parameters required for sending the email.
     * @returns {Promise<ISendEmailResponse>} Result of the email sending operation.
     */
    async sendEmailWrapper(params: ISendEmailParams): Promise<ISendEmailResponse> {
        if (!this.gmailClient) {
            return {
                status: false,
                message: 'Please initialize the Gmail client before sending emails.'
            };
        }
        return sendEmail(this.gmailClient, params);
    }
}
