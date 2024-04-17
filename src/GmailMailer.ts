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
 * Initializes the Gmail API client, supporting multiple credential provisioning methods for versatile environment adaptation. Key points:
 * - Validates the sender's email.
 * - Enables credential provisioning through:
 *   - Parameters directly passed to the method.
 *   - File paths, specified either through method parameters or environment variables.
 *   - Environment variables, offering direct JSON input or file path referencing.
 * 
 * Credentials can be provided in these ways:
 * - As JSON with `gmailServiceAccount` or through the `GMAIL_MAILER_SERVICE_ACCOUNT` environment variable.
 * - Via a file path with `gmailServiceAccountPath` or the `GMAIL_MAILER_SERVICE_ACCOUNT_PATH` environment variable.
 * 
 * The method attempts to authenticate using provided or derived service account credentials, 
 * creating a JWT client for Gmail API interactions. It prioritizes direct credentials, 
 * then file-based, and finally environment variables if others are unavailable.
 * 
 * Error handling and outcomes include:
 * - Validation for sender email, parsing service account credentials, and checking for missing configurations.
 * - Successful initialization returns:
 *   - `{ status: true, gmailClient: <Gmail API client>, message: "Gmail API client initialized successfully." }`.
 * - Failure due to errors (invalid email, parsing failures, missing configurations) results in:
 *   - `{ status: false, gmailClient: null, message: <error message> }`. 
 * 
 * Suggested Usage:
 * 
 * Development Environment:
 * - Use the `gmailServiceAccountPath` to point to your local `serviceaccount.json` file for ease of testing.
 * - Example: `initializeClient({ gmailServiceAccountPath: './path/to/serviceaccount.json' })`
 * 
 * Production Environment:
 * - Set the `GMAIL_MAILER_SERVICE_ACCOUNT` environment variable with your service account JSON. This method is secure and convenient for cloud deployments and can be encrypted in many cloud platforms.
 * - Alternatively, if available, use a secure path accessible to your production environment for `gmailServiceAccountPath`.
 * - Example: Set `GMAIL_MAILER_SERVICE_ACCOUNT` in your environment variables, or use `initializeClient({ gmailServiceAccountPath: '/secure/path/to/serviceaccount.json' })`
 * 
 * 
 * @param {IInitializeClientParams} config - Includes service account details and sender email.
 * @returns {Promise<IInitializeClientResult>} - Result of the initialization process, encapsulating success or failure status, the Gmail client instance, and an error message if applicable.
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

    // Ensure all parameters including attachments are passed to the sendEmailFunction
    const sendResult: ISendEmailFunctionResponse = await sendEmailFunction(this.gmailClient, params);

    if (!sendResult.sent) {
        return generateErrorResponse({ message: sendResult.message });
    } else {
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