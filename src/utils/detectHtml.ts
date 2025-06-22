/**
 * Checks if the content contains HTML tags.
 *
 * @param {object} options - The options object containing the content to check.
 * @param {string} options.content - The content to be checked for HTML tags.
 * @returns {object} - An object containing:
 *           isHtml: A boolean indicating whether HTML content is detected.
 *           message: A string containing a message about the outcome or an error.
 */
export function detectHtml({ content }: { content: string }): { isHtml: boolean; message: string } {
  let isHtml: boolean = false;
  let message: string = '';

  try {
    const htmlTagRegex = /<\/?[a-z]+(\s+[a-z-]+(?:="[^"]*")?)*\s*\/?>/i;
    isHtml = htmlTagRegex.test(content);
    message = isHtml ? 'HTML content detected.' : 'No HTML content detected.';
  } catch (error: any) {
    console.error('Error checking for HTML content:', error.message);
    return {
      isHtml: false, // Ensures the return value indicates no HTML was detected in case of error.
      message: `Error checking for HTML content: ${error.message}`,
    };
  }
  return { isHtml, message };
}
