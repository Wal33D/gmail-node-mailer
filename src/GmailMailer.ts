/**
 * The GmailMailer class encapsulates methods for initializing a Gmail API client and sending emails through it.
 * It handles authentication via service account credentials and provides a method to send emails with optional attachments.
 * This class supports multiple credential provisioning methods for a versatile environment adaptation, including direct parameters,
 * file paths, and environment variables.
 *
 * Key functionalities:
 * - Initializes the Gmail API client using provided or environment-based service account credentials.
 * - Sends emails using the initialized Gmail client, validating necessary input parameters such as sender's email,
 *   subject, and message content. It supports sending emails with attachments.
 *
 * Error Handling:
 * - The class provides detailed error responses for each operation, ensuring that initialization and email sending
 *   failures are clearly communicated.
 *
 * Usage:
 * - In a development environment, it is suggested to use local `serviceaccount.json` files to initialize the client.
 * - In a production environment, leveraging environment variables to provide service account details is recommended
 *   for enhanced security and convenience.
 *
 * Examples of initialization:
 * - For local testing: `initializeClient({ gmailServiceAccountPath: './path/to/serviceaccount.json' })`
 * - For production: `initializeClient({ gmailServiceAccountPath: '/secure/path/to/serviceaccount.json' })`
 * - Alternatively, set `GMAIL_MAILER_SERVICE_ACCOUNT` in your environment variables.
 *
 * This class simplifies handling Gmail interactions and abstracts the complexities of direct API management from the user.
 */
import { emailConfig } from './config/emailConfig';
import { google, gmail_v1 } from 'googleapis';
import { sendEmailFunction } from './functions/sendEmail';
import { validateEmailAddress } from './utils/validateEmailAddress';
import { generateErrorResponse } from './utils/generateErrorResponse';
import { parseServiceAccountFile } from './utils/parseServiceAccountFile';
import { gmailServiceAccountConfig } from './config/gmailServiceAccountConfig';
import {
  ISendEmailParams,
  ISendEmailResponse,
  IInitializeClientParams,
  IInitializeClientResult,
  ISendEmailFunctionResponse,
} from './types';

export class GmailMailer {
  private gmailClient: gmail_v1.Gmail | null = null;

  constructor(gmailClient?: gmail_v1.Gmail) {
    this.gmailClient = gmailClient || null;
  }

  async initializeClient({
    gmailServiceAccount = gmailServiceAccountConfig.getServiceAccount(),
    gmailServiceAccountPath = gmailServiceAccountConfig.getServiceAccountPath(),
    gmailSenderEmail = emailConfig.getGmailSenderEmail(),
  }: IInitializeClientParams): Promise<IInitializeClientResult> {
    try {
      if (!gmailSenderEmail || !validateEmailAddress({ email: gmailSenderEmail }).result) {
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
   * Orchestrates the process of sending an email by performing preliminary checks and then delegating the email 
   * construction and sending tasks to `sendEmailFunction`. This function ensures that the necessary conditions are met 
   * before attempting to send an email, including checking the initialization of the Gmail client, verifying the 
   * presence of a sender email, and ensuring that the message content is not empty. It also sets a default subject 
   * if none is provided.
   *
   * This high-level function is responsible for handling initial validations and configurations, making it an integral 
   * part of an email delivery system that requires robustness and reliability, particularly in environments such as 
   * customer support systems, automated notifications, or marketing campaigns.
   *
   * ### Parameters:
   * - `params` (ISendEmailParams): Contains the parameters required to send an email:
   *   - `senderEmail` (string, optional): Email address of the sender. Defaults to a pre-configured sender email if not provided.
   *   - `recipientEmail` (string): Email address of the recipient.
   *   - `subject` (string, optional): Subject of the email. Defaults to 'No Subject' if omitted.
   *   - `message` (string): Main content of the email, can be plain text or HTML formatted.
   *   - `attachments` (IAttachment[], optional): Array of attachments, each with a filename, mimeType, and base64-encoded content.
   *
   * ### Returns:
   * A `Promise<ISendEmailResponse>` that resolves to an object detailing the success or failure of the email operation:
   * - `sent` (boolean): Indicates whether the email was sent successfully.
   * - `status` (number, nullable): HTTP status code from the Gmail API, if available.
   * - `statusText` (string, nullable): Descriptive text corresponding to the HTTP status.
   * - `responseUrl` (string, nullable): URL of the Gmail API response, if available.
   * - `message` (string): Descriptive message about the outcome of the email operation.
   * - `gmailResponse` (any, nullable): Raw response payload from the Gmail API.
   *
   * ### Example Usage:
   * ```javascript
   * const emailParams = {
   *   senderEmail: 'sender@example.com',
   *   recipientEmail: 'recipient@example.com',
   *   subject: 'Welcome!',
   *   message: '<p>Thank you for joining us!</p>',
   *   attachments: [
   *     { filename: 'welcome.pdf', mimeType: 'application/pdf', content: 'base64-encoded-content' }
   *   ]
   * };
   *
   * const response = await sendEmail(emailParams);
   * console.log(response.message);
   * ```
   *
   * This function acts as a gateway, ensuring that all prerequisites are met before the email is sent, thus 
   * maintaining the integrity and reliability of the email sending process within your application.
   */

  async sendEmail(params: ISendEmailParams): Promise<ISendEmailResponse> {
    if (!this.gmailClient) {
      return generateErrorResponse({ message: 'The Gmail client has not been initialized. Please call initializeClient first.' });
    }

    const senderEmail = params.senderEmail || emailConfig.getGmailSenderEmail();
    if (!senderEmail) {
      console.error('Sender email not configured. Please provide a sender email.')
      return generateErrorResponse({ message: 'Sender email not configured. Please provide a sender email.' });
    }

    if (!params.message) {
      console.error('At least one of textMessage or htmlMessage must be provided.')
      return generateErrorResponse({ message: 'At least one of textMessage or htmlMessage must be provided.' });
    }

    if (!params.subject) {
      console.error(`No subject provided for the email to ${params.recipientEmail}.`);
      params.subject = 'No Subject';
    }

    const adjustedParams = { ...params, senderEmail };

    const sendResult: ISendEmailFunctionResponse = await sendEmailFunction(this.gmailClient, adjustedParams);

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