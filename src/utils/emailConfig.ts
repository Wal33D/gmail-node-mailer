import { isValidEmail } from './isValidEmail';

class EmailConfig {
    private _gmailSenderEmail: string | undefined = process.env.GMAIL_USER;

    getGmailSenderEmail(): string | undefined {
        return this._gmailSenderEmail;
    }

    setGmailSenderEmail(email: string | undefined) {
        if (email && !isValidEmail(email)) {
            throw new Error("Invalid Gmail sender's email.");
        }
        this._gmailSenderEmail = email;
    }
}

export const emailConfig = new EmailConfig();
