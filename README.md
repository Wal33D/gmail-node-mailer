# Gmail Node Mailer Package

This Node.js package simplifies sending emails using the Gmail API. It wraps the complexity of Google's authentication and email sending process into a few easy-to-use functions.

## Features

- Easy Gmail API authentication using service accounts.
- Send emails with simple function calls.
- Includes TypeScript definitions for better development experience.

## Installation

\`\`\`bash
npm install gmail-node-mailer-package
\`\`\`

Or if you prefer using Yarn:

\`\`\`bash
yarn add gmail-node-mailer-package
\`\`\`

## Quick Start

First, ensure you have a service account set up in your Google Cloud Project and have downloaded the service account JSON file. Also, make sure the Gmail API is enabled.

### Setting Up Environment Variables

Create a \`.env\` file in your project's root directory and add the following variables:

\`\`\`plaintext
GMAIL_USER=your_email@example.com
\`\`\`

Replace \`your_email@example.com\` with the email address of the Google account you wish to send emails from. Ensure this account is associated with your Google Cloud Project and has the Gmail API enabled.

### Using the Package

1. **Initialize the Email Client**

   Import and call \`initializeClient\` at the start of your application. This function initializes the Gmail API client using credentials from your service account JSON file and the sender email from your environment variables.

   \`\`\`javascript
   import { initializeClient } from 'gmail-node-mailer-package';

   const emailClient = await initializeClient();
   \`\`\`

2. **Send an Email**

   Once the client is initialized, you can send emails using the \`sendEmail\` function.

   \`\`\`javascript
   import { sendEmail } from 'gmail-node-mailer-package';

   const emailResponse = await sendEmail({
     senderEmail: 'your_email@example.com',
     recipientEmail: 'recipient@example.com',
     subject: 'Hello World',
     message: 'This is a test email sent from gmail-node-mailer-package.'
   });

   console.log(emailResponse);
   \`\`\`

## API Reference

### \`initializeClient(options?)\`

Initializes and returns the Gmail API client.

- **options** (optional): An object containing \`serviceAccount\` and \`senderEmail\`. If not provided, the package will use the service account JSON file located at \`./private/service_account.json\` and the \`GMAIL_USER\` environment variable.

### \`sendEmail({ senderEmail, recipientEmail, subject, message })\`

Sends an email using the initialized Gmail API client.

- **senderEmail**: The email address of the sender.
- **recipientEmail**: The email address of the recipient.
- **subject**: The subject of the email.
- **message**: The plain text message body of the email.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements you wish to make.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
