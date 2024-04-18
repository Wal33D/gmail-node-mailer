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
   * Sends an email using the initialized Gmail API client. This function performs several checks before sending an email:
   * 1. Ensures the Gmail client is initialized.
   * 2. Validates whether the sender email is configured. If not configured, it defaults to the configured sender email.
   * 3. Checks if a subject is provided. If no subject is provided, it logs this occurrence and sets the subject to 'No Subject'.
   * 4. Verifies that the message content is not empty.
   * If any of these checks fail, an appropriate error response is generated. Otherwise, it proceeds to send the email.
   * 
   * @param {ISendEmailParams} params - Parameters for sending the email, including:
   *   - senderEmail: Email address of the sender. If not provided, defaults to the configured sender email.
   *   - recipientEmail: Email address of the recipient.
   *   - subject: Subject of the email, can be plain text or encoded. Defaults to 'No Subject' if not provided.
   *   - message: Content of the email, which can be either plain text or HTML.
   *   - attachments (optional): Array of attachment objects, each containing filename, mimeType, and content
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

    if (!params.subject) {
      console.error(`No subject provided for the email to ${params.recipientEmail}.`);
      params.subject = 'No Subject';
    }

    if (!params.message) {
      console.error('At least one of textMessage or htmlMessage must be provided.')
      return generateErrorResponse({ message: 'At least one of textMessage or htmlMessage must be provided.' });
    }

    console.log(params.attachments)
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