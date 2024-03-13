/**
 * Initializes the Gmail API client using service account credentials.
 *
 * This function supports initialization in both development and production environments by
 * allowing service account credentials to be provided either directly as a JSON object
 * or via a path to a JSON file. The Gmail sender's email address is also required
 * and can be provided through an environment variable. This modular approach enables
 * flexible deployment configurations and simplifies authentication with the Gmail API.
 *
 * Usage:
 * - In a development environment, it's common to provide the path to a service account JSON file
 *   through an environment variable. This file contains the necessary credentials.
 * - In a production environment, the service account credentials can be supplied directly
 *   through environment variables as a JSON string, eliminating the need for external files.
 *
 * The function creates and authorizes a JWT client with the provided service account credentials
 * and scopes required for sending emails. It returns an authenticated Gmail API client that can
 * be used to interact with the Gmail API.
 *
 * Parameters:
 * - gmailServiceAccount: An optional JSON object containing the service account credentials.
 *                        If not provided, the function will look for a path to a credentials file.
 * - gmailServiceAccountPath: An optional path to a JSON file containing the service account credentials.
 *                            This is used if the credentials object is not provided directly.
 * - gmailSenderEmail: The email address of the sender. This is required for authorizing the Gmail API client.
 *
 * Returns:
 * - An instance of the Gmail API client that is authenticated and ready to use, or null if an error occurs.
 *
 * Note:
 * - The function expects certain environment variables to be set for retrieving the credentials
 *   and sender email if they are not passed as parameters. Specifically, `GMAIL_SERVICE_ACCOUNT`,
 *   `GMAIL_SERVICE_ACCOUNT_PATH`, and `GMAIL_USER` environment variables are used as fallbacks.
 */


// Import necessary modules
import { google } from 'googleapis';
import { readFileSync } from 'fs';
import * as path from 'path';

// Define the function to initialize the Gmail client
export async function initializeClient({
    // Attempt to load the Gmail service account details from environment variables by default
    gmailServiceAccount = process.env.GMAIL_SERVICE_ACCOUNT,
    gmailServiceAccountPath = process.env.GMAIL_SERVICE_ACCOUNT_PATH,
    gmailSenderEmail = process.env.GMAIL_USER,
}: {
    gmailServiceAccount?: any;
    gmailServiceAccountPath?: string;
    gmailSenderEmail?: string;
} = {}) {
    try {
        // If the service account JSON object is not provided directly,
        // check if a path to the JSON file is provided instead
        if (!gmailServiceAccount && gmailServiceAccountPath) {
            // Resolve the path to ensure it's absolute
            const absolutePath = path.resolve(gmailServiceAccountPath);
            // Read and parse the JSON file to get the service account object
            gmailServiceAccount = JSON.parse(readFileSync(absolutePath, 'utf-8'));
        } else if (!gmailServiceAccount && !gmailServiceAccountPath) {
            // If neither service account object nor path is provided, throw an error
            throw new Error("Gmail service account data or path to the JSON file must be provided.");
        }

        // Initialize a JWT client using the service account details and the sender's email address
        const jwtClient = new google.auth.JWT(
            gmailServiceAccount.client_email,
            undefined, // No need for a key file
            gmailServiceAccount.private_key,
            ['https://www.googleapis.com/auth/gmail.send'], // Scopes for sending emails
            gmailSenderEmail,
        );

        // Authorize the JWT client
        await jwtClient.authorize();

        // Create and return the Gmail API client, authenticated with the JWT client
        const gmail = google.gmail({ version: 'v1', auth: jwtClient });
        return gmail;
    } catch (error: any) {
        // In case of any errors during initialization, log the error and return null
        console.error(`[Email Client] - Failed to initialize: ${error.message}`);
        return null;
    }
}
