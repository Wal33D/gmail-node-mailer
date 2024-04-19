import { validateEmailAddress } from '../utils/validateEmailAddress';

/**
 * Manages the configuration for the Gmail sender's email.
 */
class EmailConfig {
    private _gmailSenderEmail: string | undefined = process.env.GMAIL_MAILER_SENDER_EMAIL;

    /**
     * Retrieves the currently set Gmail sender email.
     * @returns {string | undefined} The current sender email or undefined if not set.
     */
    getGmailSenderEmail(): string | undefined {
        return this._gmailSenderEmail;
    }

    /**
     * Sets the Gmail sender email after validating its format.
     * @param {string | undefined} email The sender email to set.
     * @throws {Error} Throws an error if the email is invalid.
     */
    setGmailSenderEmail(email: string | undefined) {
        if (email) {
            const validation = validateEmailAddress({ email }); 
            if (!validation.status || !validation.result) { 
                throw new Error("The provided Gmail sender's email is invalid.");
            }
        }
        this._gmailSenderEmail = email;
    }
}

export const emailConfig = new EmailConfig();