import { google } from 'googleapis';

export interface IAttachment {
    filename: string;
    mimeType: string;
    content: string;
}

export interface ISendEmailParams {
    recipientEmail: string;
    senderEmail?: string;
    subject?: string;
    message: string;
    attachments?: IAttachment[];
}

export interface ISendEmailResponse {
    sent: boolean;
    status: number | null;
    statusText: string | null;
    responseUrl: string | null;
    message: string;
    gmailResponse: any | null;
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

export interface ISendEmailFunctionResponse {
    sent: boolean;
    message: string;
    gmailResponse: any;
}
