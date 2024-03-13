// src/initializeClient.ts
import { google } from 'googleapis';

const storedServiceAccount = require('./private/gmail_service_account.json');
const storedSenderEmail = process.env.GMAIL_USER as string;

export async function initializeClient({
    serviceAccount = storedServiceAccount,
    senderEmail = storedSenderEmail,
}: {
    serviceAccount?: any;
    senderEmail?: string;
} = {}) {
    const jwtClient = new google.auth.JWT(
        serviceAccount.client_email,
        undefined,
        serviceAccount.private_key,
        ['https://www.googleapis.com/auth/gmail.send'],
        senderEmail,
    );
    await jwtClient.authorize();
    console.log('[/email/initializeEmailClient] - Gmail API client initialized successfully.');

    const gmail = google.gmail({ version: 'v1', auth: jwtClient });
    return gmail;
}