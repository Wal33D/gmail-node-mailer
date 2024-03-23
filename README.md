# Gmail Node Mailer

The \`gmail-node-mailer\` package provides a streamlined way to send emails using the Gmail API within Node.js applications. This package simplifies the process of setting up the Gmail API client, validating email addresses, and sending emails. It also offers flexibility by allowing users to configure the Gmail service account and sender email dynamically.

## Features

- Initialize the Gmail API client with service account credentials.
- Validate sender and recipient email addresses.
- Send emails with customizable sender, recipient, subject, and message content.
- Configure service account and sender email through utility functions.

## Getting Started

### Installation

To install the package, run the following command in your Node.js project directory:

\`\`\`bash
npm install gmail-node-mailer
\`\`\`

### Usage

1. **Initialize the Gmail API Client**

   Before sending emails, you must initialize the Gmail API client with your service account credentials.

   \`\`\`typescript
   import { GmailMailer } from 'gmail-node-mailer';

   const mailer = new GmailMailer();

   // Initialize with your service account credentials
   await mailer.initializeClient({
     gmailServiceAccountPath: '/path/to/service-account.json',
   });
   \`\`\`

2. **Send an Email**

   After initializing the client, you can send emails by providing the sender, recipient, subject, and message.

   \`\`\`typescript
   const emailParams = {
     senderEmail: 'your-email@gmail.com',
     recipientEmail: 'recipient-email@gmail.com',
     subject: 'Hello from Gmail Node Mailer',
     message: 'This is a test email sent using the Gmail Node Mailer package.',
   };

   const response = await mailer.sendEmailWrapper(emailParams);
   console.log(response.message);
   \`\`\`

## Configuration

- **Service Account**: Set the path to your service account JSON file or directly provide the service account object.
- **Sender Email**: Configure the default sender email address.

## Utilities

This package includes utilities for validating email addresses, parsing service account files, and managing configuration settings.

## Contributing

Contributions, issues, and feature requests are welcome! Feel free to check [issues page](#).

## License

Distributed under the MIT License. See \`LICENSE\` for more information.
