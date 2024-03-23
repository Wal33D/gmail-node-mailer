import { IGmailServiceAccount } from '../types';

class GmailServiceAccountConfig {
    private _serviceAccount: IGmailServiceAccount | null = null;
    private _serviceAccountPath: string | null = null;

    get serviceAccount(): IGmailServiceAccount | null {
        return this._serviceAccount;
    }

    set serviceAccount(account: IGmailServiceAccount | null) {
        this._serviceAccount = account;
    }

    get serviceAccountPath(): string | null {
        return this._serviceAccountPath;
    }

    set serviceAccountPath(path: string | null) {
        this._serviceAccountPath = path;
    }
}

export const gmailServiceAccountConfig = new GmailServiceAccountConfig();
