import { google } from 'googleapis';
import { readFileSync } from 'fs';
import * as path from 'path';

export async function initializeClient({
    gmailServiceAccount = process.env.GMAIL_SERVICE_ACCOUNT,
    gmailServiceAccountPath = process.env.GMAIL_SERVICE_ACCOUNT_PATH,
    gmailSenderEmail = process.env.GMAIL_USER,
}: {
    gmailServiceAccount?: any;
    gmailServiceAccountPath?: string;
    gmailSenderEmail?: string;
} = {}) {
    try {
        if (!gmailServiceAccount && gmailServiceAccountPath) {
            const absolutePath = path.resolve(gmailServiceAccountPath);
            gmailServiceAccount = JSON.parse(readFileSync(absolutePath, 'utf-8'));
        } else if (!gmailServiceAccount && !gmailServiceAccountPath) {
            throw new Error("Gmail service account data or path to the JSON file must be provided.");
        }

        const jwtClient = new google.auth.JWT(
            gmailServiceAccount.client_email,
            undefined,
            gmailServiceAccount.private_key,
            ['https://www.googleapis.com/auth/gmail.send'],
            gmailSenderEmail,
        );

        await jwtClient.authorize();

        const gmail = google.gmail({ version: 'v1', auth: jwtClient });
        return {
            status: true,
            gmailClient: gmail,
            message: "Success: Gmail API client initialized successfully."
        };
    } catch (error: any) {
        return {
            status: false,
            gmailClient: null,
            message: `Error: Failed to initialize Gmail API client. ${error.message}`
        };
    }
}
