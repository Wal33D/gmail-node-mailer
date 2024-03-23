import * as path from 'path';
import { promises as fsPromises } from 'fs';
import { IGmailServiceAccount } from '../types';

/**
 * Asynchronously parses a service account file and validates its content.
 * 
 * @param {Object} params - Parameters for parsing the service account file.
 * @param {string} params.filePath - The file path of the service account JSON file.
 * @returns {Promise<{status: boolean, serviceAccount: IGmailServiceAccount | null, message: string}>} 
 *          The result of parsing the service account file, including status, the service account object (if successful), and a message.
 */
export async function parseServiceAccountFile({ filePath }: { filePath: string }): Promise<{ status: boolean; serviceAccount: IGmailServiceAccount | null; message: string }> {
    try {
        const absolutePath = path.resolve(filePath);
        const fileContents = await fsPromises.readFile(absolutePath, 'utf-8');
        const parsedAccount: IGmailServiceAccount = JSON.parse(fileContents);

        if (!parsedAccount.private_key || !parsedAccount.client_email) {
            return {
                status: false,
                serviceAccount: null,
                message: "The service account file lacks required 'private_key' or 'client_email' fields."
            };
        }

        return {
            status: true,
            serviceAccount: parsedAccount,
            message: `Successfully loaded service account for '${parsedAccount.client_email}'.`
        };
    } catch (error: any) {
        let errorMessage = 'An error occurred while parsing the service account file.';
        if (error.code === 'ENOENT') {
            errorMessage = `File not found at provided path: ${filePath}.`;
        } else if (error instanceof SyntaxError) {
            errorMessage = `Service account file contains invalid JSON: ${filePath}.`;
        } else {
            errorMessage += ` Error: ${error.message}`;
        }

        return {
            status: false,
            serviceAccount: null,
            message: errorMessage
        };
    }
}
