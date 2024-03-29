import { google, gmail_v1 } from 'googleapis';
import { sendEmailFunction } from './functions/sendEmail';
import { isValidEmail } from './utils/isValidEmail';
import { parseServiceAccountFile } from './utils/parseServiceAccountFile';
import { emailConfig } from './utils/emailConfig';
import { gmailServiceAccountConfig } from './utils/gmailServiceAccountConfig';
import { generateErrorResponse } from './utils/generateErrorResponse';
import {
  IInitializeClientParams,
  IInitializeClientResult,
  ISendEmailFunctionResponse,
  ISendEmailParams,
  ISendEmailResponse
} from './types';

export class GmailMailer {
  private gmailClient: gmail_v1.Gmail | null = null;

  constructor(gmailClient?: gmail_v1.Gmail) {
    this.gmailClient = gmailClient || null;
  }

  /**
   * Initializes the Gmail API client using the provided configuration. Validates the Gmail sender email
   * and uses service account credentials for authentication. If the service account is not directly provided,
   * it attempts to load it from a specified file path.
   * 
   * @param {IInitializeClientParams} config Configuration for Gmail client initialization including service account details and sender email.
   * @returns {Promise<IInitializeClientResult>} The result of the initialization attempt, including status and any error messages.
   */
  async initializeClient({
    gmailServiceAccount = gmailServiceAccountConfig.getServiceAccount(),
    gmailServiceAccountPath = gmailServiceAccountConfig.getServiceAccountPath(),
    gmailSenderEmail = emailConfig.getGmailSenderEmail(),
  }: IInitializeClientParams): Promise<IInitializeClientResult> {
    try {
      if (!gmailSenderEmail || !isValidEmail({ email: gmailSenderEmail }).result) {
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
   * Sends an email using the initialized Gmail API client. It validates the sender email, ensures a subject
   * is provided, and verifies that the message content is present before proceeding.
   * 
   * @param {ISendEmailParams} params Parameters for sending the email, including recipient, sender, subject, and message.
   * @returns {Promise<ISendEmailResponse>} The result of the email sending operation, including status and any response details.
   */
  async sendEmail(params: ISendEmailParams): Promise<ISendEmailResponse> {
    if (!this.gmailClient) {
      return generateErrorResponse({ message: 'The Gmail client has not been initialized. Please call initializeClient first.' });
    }

    const senderEmail = params.senderEmail || emailConfig.getGmailSenderEmail();
    if (!senderEmail) {
      return generateErrorResponse({ message: 'Sender email not configured. Please provide a sender email.' });
    }

    if (!params.subject) {
      return generateErrorResponse({ message: 'A subject (text or encoded) must be provided.' });
    }

    if (!params.message) {
      return generateErrorResponse({ message: 'At least one of textMessage or htmlMessage must be provided.' });
    }

    const adjustedParams = { ...params, senderEmail };

    // Assuming sendEmailFunction is properly imported and utilized
    const sendResult: ISendEmailFunctionResponse = await sendEmailFunction(this.gmailClient, adjustedParams);

    if (!sendResult.sent) {
      // Handling failure from the sendEmail function
      return generateErrorResponse({ message: sendResult.message });
    } else {
      // Handling success from the sendEmail function
      return {
        sent: sendResult.sent,
        status: sendResult.gmailResponse?.status || null,
        statusText: sendResult.gmailResponse?.statusText || null,
        responseUrl: sendResult.gmailResponse?.request?.responseURL || null,
        message: sendResult.message,
        gmailResponse: sendResult.gmailResponse || null,
      };
    }
  }

}