import { google } from 'googleapis';

// Interface for attachment details in an email
export interface IAttachment {
    filename: string;
    mimeType: string;
    content: string;
}

// Interface for service account details used for Gmail API authentication
export interface IGmailServiceAccount {
    private_key: string;
    client_email: string;
}

// Interface for parameters required to initialize the Gmail client
export interface IInitializeClientParams {
    gmailServiceAccount?: IGmailServiceAccount;
    gmailServiceAccountPath?: string;
    gmailSenderEmail?: string;
}

// Interface for the result of initializing the Gmail client
export interface IInitializeClientResult {
    status: boolean;
    gmailClient: typeof google.gmail_v1.Gmail | null;
    message: string;
}

// Interface for the response from the email sending function
export interface ISendEmailFunctionResponse {
    sent: boolean;
    message: string;
    gmailResponse: any;
}

// Interface for parameters required to send an email via Gmail API
export interface ISendEmailParams {
    recipientEmail: string;
    senderEmail?: string;
    subject?: string;
    message: string;
    attachments?: IAttachment[];
}

// Interface for the response received after sending an email via Gmail API
export interface ISendEmailResponse {
    sent: boolean;
    status: number | null;
    statusText: string | null;
    responseUrl: string | null;
    message: string;
    gmailResponse: any | null;
};

// Enum defining the types of encoding applicable to email components.
export enum EncodingType {
    Subject = 'subject',
    MimeMessage = 'mimeMessage',
    Attachment = 'attachment'
}

// Represents the parameters required for encoding email content.
export interface IEncodeEmailContentParams {
    content: string;
    type: EncodingType;
}

// Represents the response from encoding email content.
export interface IEncodeEmailContentResponse {
    isEncoded: boolean;
    encodedContent: string;
    message: string;
}
