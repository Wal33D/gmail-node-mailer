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
 * Initializes the Gmail API client using the provided or environment-based configuration. This method validates the
 * Gmail sender's email address and authenticates using service account credentials. It supports multiple ways to provide
 * these credentials: directly via parameters, loaded from a file path, or parsed from an environment variable.
 * 
 * If the service account credentials are not directly provided, the method first attempts to load them from the specified
 * file path. If no path is provided or if the file does not contain valid credentials, it then attempts to parse the
 * credentials from the `GMAIL_MAILER_SERVICE_ACCOUNT` environment variable. This environment variable should contain
 * the JSON representation of the service account credentials.
 * 
 * This flexible initialization approach allows the GmailMailer to be configured in various deployment environments,
 * supporting both file-based configurations for development and direct JSON configurations for environments where
 * file access may be restricted or inconvenient. Specifically, this design facilitates easy integration across different
 * environments, such as development and production. For instance, while running on a platform like Digital Ocean, the
 * `GMAIL_MAILER_SERVICE_ACCOUNT` environment variable can be set to provide the service account details directly in production,
 * whereas in a development environment, the `gmailServiceAccountPath` can be used to point to a local file with the service
 * account credentials. This ensures that the package can automatically adapt to both environments without requiring code changes,
 * simplifying the deployment process and enhancing operational efficiency.
 * 
 * @param {IInitializeClientParams} config - Configuration for Gmail client initialization, including service account details and sender email.
 * @returns {Promise<IInitializeClientResult>} - The result of the initialization attempt, including the status, initialized Gmail client instance, and any error messages.
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
  
      // If gmailServiceAccountPath is not provided, use the environment variable
      if (!gmailServiceAccountPath) {
        gmailServiceAccountPath = process.env.GMAIL_MAILER_SERVICE_ACCOUNT_PATH;
      }
  
      if (!gmailServiceAccount && gmailServiceAccountPath) {
        const serviceAccountResult = await parseServiceAccountFile({ filePath: gmailServiceAccountPath });
        if (!serviceAccountResult.status || !serviceAccountResult.serviceAccount) {
          throw new Error(serviceAccountResult.message);
        }
        gmailServiceAccount = serviceAccountResult.serviceAccount; // Set the gmailServiceAccount with the loaded service account
      }
  
      // Check for service account JSON in GMAIL_MAILER_SERVICE_ACCOUNT environment variable as a fallback
      if (!gmailServiceAccount && process.env.GMAIL_MAILER_SERVICE_ACCOUNT) {
        try {
          gmailServiceAccount = JSON.parse(process.env.GMAIL_MAILER_SERVICE_ACCOUNT);
        } catch (error) {
          throw new Error("Failed to parse service account from GMAIL_MAILER_SERVICE_ACCOUNT environment variable.");
        }
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