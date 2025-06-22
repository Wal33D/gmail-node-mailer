import { Buffer } from 'buffer';
import { EncodingType, IEncodeEmailContentParams, IEncodeEmailContentResponse } from '../types';

/**
 * Encodes various types of content related to emails into Base64 or URL-safe Base64 formats.
 * This function is versatile, handling encoding for email subjects, MIME messages, and attachments.
 * It automatically applies URL-safe encoding for MIME messages and standard Base64 encoding for others.
 * If the content for an email subject is empty, it defaults to 'No Subject'.
 *
 * The function provides robust error handling, ensuring that any encoding issues are gracefully managed
 * and reported back to the caller through a structured response, including a success flag, the encoded content,
 * and a message describing the outcome of the operation.
 *
 * @param {IEncodeEmailContentParams} params - Parameters containing the content to encode and the type of encoding.
 *    - `content`: The actual string content to encode.
 *    - `type`: The type of content being encoded (subject, MIME message, or attachment).
 * @returns {IEncodeEmailContentResponse} - A response object containing:
 *    - `isEncoded`: A boolean indicating if the encoding was successful.
 *    - `encodedContent`: The resulting encoded string.
 *    - `message`: A description of the outcome or error message if an error occurred.
 */

export function encodeEmailContent({
  content,
  type,
}: IEncodeEmailContentParams): IEncodeEmailContentResponse {
  let encodedContent = content;
  let message = '';
  const base64Pattern = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;

  try {
    switch (type) {
      case EncodingType.Subject:
        if (!content) {
          content = 'No Subject'; // Default subject if none provided
        }
        encodedContent = `=?utf-8?B?${Buffer.from(content, 'utf-8').toString('base64')}?=`;
        message = 'Email subject encoded successfully.';
        break;
      case EncodingType.MimeMessage:
        encodedContent = Buffer.from(content, 'utf-8')
          .toString('base64')
          .replace(/\+/g, '-')
          .replace(/\//g, '_');
        message = 'MIME message encoded successfully.';
        break;
      case EncodingType.Attachment:
        if (!base64Pattern.test(content)) {
          encodedContent = Buffer.from(content, 'utf-8').toString('base64');
          message = 'Attachment content encoded successfully.';
        } else {
          message = 'Attachment content was already Base64 encoded.';
        }
        break;
      default:
        throw new Error('Invalid encoding type specified.');
    }
  } catch (error: any) {
    console.error(`Error encoding ${type}:`, error.message);
    return {
      isEncoded: false,
      encodedContent: content, // Return original content on error
      message: `Error during encoding: ${error.message}`,
    };
  }

  return {
    isEncoded: true,
    encodedContent,
    message,
  };
}
