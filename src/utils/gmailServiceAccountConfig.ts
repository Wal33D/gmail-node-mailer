import { IGmailServiceAccount } from '../types';

class GmailServiceAccountConfig {
    private _serviceAccount: IGmailServiceAccount | null = null;
    private _serviceAccountPath: string | null = null;

    get SERVICE_ACCOUNT(): IGmailServiceAccount | null {
        return this._serviceAccount;
    }

    set SERVICE_ACCOUNT(account: IGmailServiceAccount | null) {
        this._serviceAccount = account;
    }

    get SERVICE_ACCOUNT_PATH(): string | null {
        return this._serviceAccountPath;
    }

    set SERVICE_ACCOUNT_PATH(path: string | null) {
        this._serviceAccountPath = path;
    }
}

export const gmailServiceAccountConfig = new GmailServiceAccountConfig();
