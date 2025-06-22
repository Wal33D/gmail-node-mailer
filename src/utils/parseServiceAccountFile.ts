import * as path from 'path';
import { promises as fsPromises } from 'fs';
import { IGmailServiceAccount, IParseServiceAccountResult } from '../types';

/**
 * Checks if the provided error object has a `code` property.
 * @param {any} error - The error object to check.
 * @returns {boolean} - True if the error has a `code` property, false otherwise.
 */
function hasErrorCode(error: any): error is NodeJS.ErrnoException {
  return 'code' in error;
}

/**
 * Asynchronously parses a service account file and validates its content.
 *
 * @param {Object} params - Parameters for parsing the service account file.
 * @param {string} params.filePath - The file path of the service account JSON file.
 * @returns {Promise<IParseServiceAccountResult>}
 *          The result of parsing the service account file, including status, the service account object (if successful), and a message.
 */
export async function parseServiceAccountFile({ filePath }: { filePath: string }): Promise<IParseServiceAccountResult> {
  try {
    const absolutePath = path.resolve(filePath);
    const fileContents = await fsPromises.readFile(absolutePath, 'utf-8');
    const parsedAccount: IGmailServiceAccount = JSON.parse(fileContents);

    if (!parsedAccount.private_key || !parsedAccount.client_email) {
      return {
        status: false,
        serviceAccount: undefined,
        message: `The service account file at '${filePath}' lacks required 'private_key' or 'client_email' fields.`,
      };
    }

    return {
      status: true,
      serviceAccount: parsedAccount,
      message: `Successfully loaded service account for '${parsedAccount.client_email}' from '${filePath}'.`,
    };
  } catch (error: any) {
    let errorMessage = 'An error occurred while parsing the service account file.';
    if (hasErrorCode(error) && error.code === 'ENOENT') {
      errorMessage = `File not found at provided path: '${filePath}'.`;
    } else if (error instanceof SyntaxError) {
      errorMessage = `Service account file at '${filePath}' contains invalid JSON.`;
    } else {
      errorMessage += ` Error: ${error.message}`;
    }

    return {
      status: false,
      serviceAccount: undefined,
      message: errorMessage,
    };
  }
}
