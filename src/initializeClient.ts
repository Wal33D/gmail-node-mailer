// Importing necessary modules
import * as path from 'path';
import { google } from 'googleapis';
import { readFileSync } from 'fs';
import { isValidEmail } from './utils/isValidEmail';
import { IInitializeClientParams, IInitializeClientResult} from './types';

// The initializeClient function with types applied
export async function initializeClient({
    gmailServiceAccount = JSON.parse(process.env.GMAIL_SERVICE_ACCOUNT || '{}'),
    gmailServiceAccountPath = process.env.GMAIL_SERVICE_ACCOUNT_PATH,
    gmailSenderEmail = process.env.GMAIL_USER,
}: IInitializeClientParams): Promise<IInitializeClientResult> {
    try {
        // Validate the sender's email
        if (!gmailSenderEmail || !isValidEmail(gmailSenderEmail)) {
            throw new Error("Invalid or missing Gmail sender's email.");
        }

        // Load the service account from the path if not directly provided
        if (!gmailServiceAccount && gmailServiceAccountPath) {
            const absolutePath = path.resolve(gmailServiceAccountPath);
            gmailServiceAccount = JSON.parse(readFileSync(absolutePath, 'utf-8'));
        } else if (!gmailServiceAccount && !gmailServiceAccountPath) {
            throw new Error("Gmail service account data or path to the JSON file must be provided.");
        }

        // Initialize the JWT client with the service account credentials
        const jwtClient = new google.auth.JWT(
            gmailServiceAccount.client_email,
            undefined,
            gmailServiceAccount.private_key,
            ['https://www.googleapis.com/auth/gmail.send'],
            gmailSenderEmail,
        );

        // Authorize and create the Gmail client
        await jwtClient.authorize();
        const gmailClient = google.gmail({ version: 'v1', auth: jwtClient });

        // Return success state
        return {
            status: true,
            gmailClient,
            message: "Success: Gmail API client initialized successfully."
        };
    } catch (error: any) {
        // Return failure state with error message
        return {
            status: false,
            gmailClient: null,
            message: `Error: ${error.message}`
        };
    }
}
