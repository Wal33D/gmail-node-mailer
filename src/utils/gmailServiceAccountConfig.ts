import { IGmailServiceAccount } from '../types';

class GmailServiceAccountConfig {
    private _serviceAccount: IGmailServiceAccount | null = null;
    private _serviceAccountPath: string | null = null;

    get_SERVICE_ACCOUNT(): IGmailServiceAccount | null {
        return this._serviceAccount;
    }

    set_SERVICE_ACCOUNT(account: IGmailServiceAccount | null) {
        this._serviceAccount = account;
    }

    get_SERVICE_ACCOUNT_PATH(): string | null {
        return this._serviceAccountPath;
    }

    set_SERVICE_ACCOUNT_PATH(path: string | null) {
        this._serviceAccountPath = path;
    }
}

export const gmailServiceAccountConfig = new GmailServiceAccountConfig();
