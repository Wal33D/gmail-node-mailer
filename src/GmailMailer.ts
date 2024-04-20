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
 * This function orchestrates the sending of an email using a pre-initialized Gmail API client. It includes several
 * pre-send checks to ensure the integrity and completeness of the email to be sent. These checks include validating
 * the initialization of the Gmail client, ensuring a sender email is set, verifying the presence of a message body,
 * and providing a default subject if none is provided.
 *
 * The function is designed to be robust, logging errors and generating appropriate error responses for various
 * failure scenarios before attempting to send the email. If all checks are passed, it delegates to the
 * `sendEmailFunction` to perform the actual email sending operation.
 *
 * ### Parameters:
 * - `params` (ISendEmailParams): Object containing the necessary parameters to construct and send an email:
 *   - `senderEmail` (string, optional): The email address of the sender. Defaults to a configured sender email if not provided.
 *   - `recipientEmail` (string): The email address of the recipient.
 *   - `subject` (string, optional): The subject of the email. Defaults to 'No Subject' if omitted.
 *   - `message` (string): The main content of the email, which can be either plain text or HTML formatted.
 *   - `attachments` (array of IAttachment, optional): An array of attachment objects. Each attachment should have a `filename`,
 *     `mimeType`, and `content` encoded in base64.
 *
 * ### Returns:
 * A `Promise<ISendEmailResponse>` that resolves to an object indicating the outcome of the email sending operation. This object
 * includes the following properties:
 * - `sent` (boolean): Indicates whether the email was sent successfully.
 * - `status` (number, nullable): The HTTP status code returned by the Gmail API, if available.
 * - `statusText` (string, nullable): A textual description of the HTTP status, if available.
 * - `responseUrl` (string, nullable): The URL of the Gmail API response, if available.
 * - `message` (string): A message describing the result of the email operation, useful for debugging and user feedback.
 * - `gmailResponse` (any, nullable): The raw response payload from the Gmail API, providing detailed success or error information.
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
 * This function is essential for applications that require reliable email delivery such as customer support systems,
 * automated notification services, or marketing email delivery systems.
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