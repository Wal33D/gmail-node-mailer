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
    private _gmailSenderEmail: string | undefined = process.env.GMAIL_USER; 

    // Getter for GMAIL_SENDER_EMAIL
    get GMAIL_SENDER_EMAIL(): string | undefined {
        return this._gmailSenderEmail;
    }

    // Setter for GMAIL_SENDER_EMAIL
    set GMAIL_SENDER_EMAIL(email: string | undefined) {
        if (email && !isValidEmail(email)) {
            throw new Error("Invalid Gmail sender's email.");
        }
        this._gmailSenderEmail = email;
    }

    async initializeClient({
        gmailServiceAccount,
        gmailServiceAccountPath,
        gmailSenderEmail = this._gmailSenderEmail, // Use the private field
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

            this._gmailSenderEmail = gmailSenderEmail; // Update the private field with the provided value or the default

            const jwtClient = new google.auth.JWT(
                gmailServiceAccount.client_email,
                undefined,
                gmailServiceAccount.private_key,
                ['https://www.googleapis.com/auth/gmail.send'],
                this._gmailSenderEmail,
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
