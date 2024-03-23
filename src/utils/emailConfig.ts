import { isValidEmail } from './isValidEmail';

class EmailConfig {
    private _gmailSenderEmail: string | undefined = process.env.GMAIL_USER;

    get GMAIL_SENDER_EMAIL(): string | undefined {
        return this._gmailSenderEmail;
    }

    set GMAIL_SENDER_EMAIL(email: string | undefined) {
        if (email && !isValidEmail(email)) {
            throw new Error("Invalid Gmail sender's email.");
        }
        this._gmailSenderEmail = email;
    }
}

export const emailConfig = new EmailConfig();
