import * as path from 'path';
import { readFileSync } from 'fs';
import { IGmailServiceAccount } from '../types'; 

export async function parseServiceAccountFile({ filePath }: { filePath: string }): Promise<{ status: boolean; serviceAccount: IGmailServiceAccount | null; message: string }> {
    try {
        const absolutePath = path.resolve(filePath);
        const fileContents = readFileSync(absolutePath, 'utf-8');
        const parsedAccount: IGmailServiceAccount = JSON.parse(fileContents);

        if (!parsedAccount.private_key || !parsedAccount.client_email) {
            return {
                status: false,
                serviceAccount: null,
                message: "The service account file is missing required fields: 'private_key' or 'client_email'."
            };
        }

        return {
            status: true,
            serviceAccount: parsedAccount,
            message: `Service account for '${parsedAccount.client_email}' loaded successfully.`
        };
    } catch (error: any) {
        return {
            status: false,
            serviceAccount: null,
            message: `Failed to parse service account file: ${error.message}`
        };
    }
}