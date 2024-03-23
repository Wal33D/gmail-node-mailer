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
      * Wraps the sendEmail function to use the initialized Gmail client and sender email.
      * 
      * @param {ISendEmailParams} params Parameters for sending the email, with optional senderEmail.
      * @returns {Promise<ISendEmailResponse>} The result of attempting to send the email.
      */
     
    async sendEmailWrapper(params: ISendEmailParams): Promise<ISendEmailResponse> {
        if (!this.gmailClient) {
            return {
                status: false,
                message: 'The Gmail client has not been initialized. Please call initializeClient first.'
            };
        }

        // Use the senderEmail from emailConfig if it's not provided in params.
        const senderEmail = params.senderEmail || emailConfig.getGmailSenderEmail();

        // Ensure there is a sender email to use.
        if (!senderEmail) {
            return {
                status: false,
                message: 'Sender email is not configured. Please provide a sender email.'
            };
        }

        // Adjust the params object to include the senderEmail from emailConfig if necessary.
        const adjustedParams = { ...params, senderEmail };

        return sendEmail(this.gmailClient, adjustedParams);
    }
}