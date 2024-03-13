// ./types/email.ts
import { google } from 'googleapis';

export interface ISendEmailResponse {
    sent: boolean;
    status: number;
    message: string;
};

// Interface for the parameters accepted by the initializeClient function remains the same
export interface IInitializeClientParams {
    gmailServiceAccount?: IGmailServiceAccount;
    gmailServiceAccountPath?: string;
    gmailSenderEmail?: string;
}

// Interface for the function's return type remains the same
export interface IInitializeClientResult {
    status: boolean;
    gmailClient: typeof google.gmail_v1.Gmail | null;
    message: string;
}
// Interface for the Gmail service account credentials
export interface IGmailServiceAccount {
    private_key: string;
    client_email: string;
}
