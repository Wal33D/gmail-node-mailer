import { IGmailServiceAccount } from '../types/types';

/**
 * Manages configuration for the Gmail service account.
 */
class GmailServiceAccountConfig {
    private _serviceAccount: IGmailServiceAccount | undefined = undefined;
    private _serviceAccountPath: string | undefined = undefined;

    /**
     * Retrieves the currently set Gmail service account.
     * @returns {IGmailServiceAccount | undefined} The current service account or undefined if not set.
     */
    getServiceAccount(): IGmailServiceAccount | undefined {
        return this._serviceAccount;
    }

    /**
     * Sets the Gmail service account.
     * @param {IGmailServiceAccount | undefined} account The service account to set.
     */
    setServiceAccount(account: IGmailServiceAccount | undefined) {
        this._serviceAccount = account;
    }

    /**
     * Retrieves the path to the Gmail service account file.
     * @returns {string | undefined} The current service account file path or undefined if not set.
     */
    getServiceAccountPath(): string | undefined {
        return this._serviceAccountPath;
    }

    /**
     * Sets the path to the Gmail service account file.
     * @param {string | undefined} path The file path to set.
     */
    setServiceAccountPath(path: string | undefined) {
        this._serviceAccountPath = path;
    }
}

export const gmailServiceAccountConfig = new GmailServiceAccountConfig();
