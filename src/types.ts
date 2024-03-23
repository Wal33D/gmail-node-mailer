import { google } from 'googleapis';

export interface ISendEmailParams {
    senderEmail: string;
    recipientEmail: string;
    subject: string;
    message: string;
}

export interface ISendEmailResponse {
    sent: boolean;
    status: number;
    message: string;
};

export interface IInitializeClientParams {
    gmailServiceAccount?: IGmailServiceAccount;
    gmailServiceAccountPath?: string;
    gmailSenderEmail?: string;
}

export interface IInitializeClientResult {
    status: boolean;
    gmailClient: typeof google.gmail_v1.Gmail | null;
    message: string;
}
export interface IGmailServiceAccount {
    private_key: string;
    client_email: string;
}