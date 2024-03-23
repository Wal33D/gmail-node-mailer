import { IGmailServiceAccount } from '../types';

class GmailServiceAccountConfig {
    private _serviceAccount: IGmailServiceAccount | undefined = undefined;
    private _serviceAccountPath: string | undefined = undefined;

    get_SERVICE_ACCOUNT(): IGmailServiceAccount | undefined {
        return this._serviceAccount;
    }

    set_SERVICE_ACCOUNT(account: IGmailServiceAccount | undefined) {
        this._serviceAccount = account;
    }

    get_SERVICE_ACCOUNT_PATH(): string | undefined {
        return this._serviceAccountPath;
    }

    set_SERVICE_ACCOUNT_PATH(path: string | undefined) {
        this._serviceAccountPath = path;
    }
}

export const gmailServiceAccountConfig = new GmailServiceAccountConfig();

