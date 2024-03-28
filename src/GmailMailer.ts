import { google, gmail_v1 } from 'googleapis';
import { sendEmail as sendEmailFunction } from './functions/sendEmail';
import { isValidEmail } from './utils/isValidEmail';
import { parseServiceAccountFile } from './utils/parseServiceAccountFile';
import { emailConfig } from './utils/emailConfig';
import { gmailServiceAccountConfig } from './utils/gmailServiceAccountConfig';
import {
  IInitializeClientParams,
  IInitializeClientResult, 
  ISendEmailParams,
  ISendEmailResponse
} from './types';

export class GmailMailer {
  private gmailClient: gmail_v1.Gmail | null = null;
  
  constructor(gmailClient?: gmail_v1.Gmail) {
    this.gmailClient = gmailClient || null;
  }

  /**
   * Initializes the Gmail API client with provided configuration.
   * Validates the Gmail sender email and uses service account credentials for authentication.
   * 
   * @param {IInitializeClientParams} config - Configuration for Gmail client initialization.
   * @returns {Promise<IInitializeClientResult>} - Result of initialization attempt.
   */
  async initializeClient({
    gmailServiceAccount = gmailServiceAccountConfig.getServiceAccount(),
    gmailServiceAccountPath = gmailServiceAccountConfig.getServiceAccountPath(),
    gmailSenderEmail = emailConfig.getGmailSenderEmail(),
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
        gmailServiceAccountConfig.setServiceAccount(serviceAccountResult.serviceAccount);
      }

      if (!gmailServiceAccount) {
        throw new Error("Service account configuration is missing.");
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
        message: "Gmail API client initialized successfully."
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
    * Sends an email using the initialized Gmail API client. Validates sender email if not provided.
    * 
    * @param {ISendEmailParams} params - Email sending parameters.
    * @returns {Promise<ISendEmailResponse>} - Result of the email sending operation.
    */
  async sendEmail(params: ISendEmailParams): Promise<ISendEmailResponse> {
    if (!this.gmailClient) {
      return {
        status: false,
        message: 'Gmail client not initialized. Please initialize before sending emails.',
        response: null,
      };
    }

    const senderEmail = params.senderEmail || emailConfig.getGmailSenderEmail();
    if (!senderEmail) {
      return {
        status: false,
        message: 'Sender email not configured. Please provide a sender email.',
        response: null,
      };
    }

    const adjustedParams = { ...params, senderEmail };
    return sendEmailFunction(this.gmailClient, adjustedParams);
  }
}
