import { IGmailServiceAccount } from '../types';

class GmailServiceAccountConfig {
    private _serviceAccount: IGmailServiceAccount | undefined = undefined;
    private _serviceAccountPath: string | undefined = undefined;

    getServiceAccount(): IGmailServiceAccount | undefined {
        return this._serviceAccount;
    }

    setServiceAccount(account: IGmailServiceAccount | undefined) {
        this._serviceAccount = account;
    }

    getServiceAccountPath(): string | undefined {
        return this._serviceAccountPath;
    }

    setServiceAccountPath(path: string | undefined) {
        this._serviceAccountPath = path;
    }
}

export const gmailServiceAccountConfig = new GmailServiceAccountConfig();

