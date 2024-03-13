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
        // If the direct service account data is not provided, try loading from the provided path
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
        console.log('[/email/initializeEmailClient] - Gmail API client initialized successfully.');

        const gmail = google.gmail({ version: 'v1', auth: jwtClient });
        return gmail;
    } catch (error: any) {
        return null;
    }
}
