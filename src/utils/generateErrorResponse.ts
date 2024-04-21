import { ISendEmailResponse } from '../types';

/**
 * Generates a default error response for the sendEmail method.
 * 
 * @param {string} message - Error message to be included in the response.
 * @returns {ISendEmailResponse} - Default error response object.
 */
export function generateErrorResponse({ message }: { message: string }): ISendEmailResponse {
  return {
    sent: false,
    status: null,
    statusText: null,
    responseUrl: null,
    message,
    gmailResponse: null,
  };
}
