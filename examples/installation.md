# Installation and Setup

Getting started with `gmail-node-mailer` is straightforward. This guide will walk you through installing the package in your Node.js project and setting it up for your first email send.

## Installation

1. **With NPM**

   Open your terminal, navigate to your project directory, and run:

   ```bash
   npm install gmail-node-mailer
   ```

   This command installs `gmail-node-mailer` and adds it to your project's dependencies.

## Initial Setup

After installation, you're just a few steps away from sending emails.

### Setting Up Your Gmail API Credentials

`gmail-node-mailer` utilizes the Gmail API to send emails, which requires setting up a service account for authentication:

1. Visit the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project or select an existing one.
3. Navigate to **APIs & Services > Credentials**.
4. Click **+ Create Credentials** and select **Service account**.
5. Follow the on-screen instructions to create a service account. Download the JSON file containing your credentials.

### Integrating `gmail-node-mailer` into Your Project

With your service account credentials ready, you can now initialize `gmail-node-mailer` in your project:

1. **Import `GmailMailer`**

   Start by importing `GmailMailer` into your script or application entry point.

   ```typescript
   import { GmailMailer } from 'gmail-node-mailer';
   ```

2. **Initialize the Client**

   Create an instance of `GmailMailer` and initialize it with your service account credentials.

   ```typescript
   const mailer = new GmailMailer();

   async function setupMailer() {
     await mailer.initializeClient({
       gmailServiceAccountPath: './path/to/your-service-account.json',
     });

     // GmailMailer is now ready to send emails
   }

   setupMailer().catch(console.error);
   ```

   Here, `gmailServiceAccountPath` is the path to the JSON file you downloaded from the Google Cloud Console.

### Sending Your First Email

With `gmail-node-mailer` set up, sending an email is as simple as:

```typescript
async function sendTestEmail() {
  await mailer.sendEmail({
    senderEmail: 'your-email@gmail.com',
    recipientEmail: 'recipient@example.com',
    subject: 'Test Email from gmail-node-mailer',
    message: 'This is a test email sent using gmail-node-mailer.',
  });

  console.log("Test email sent successfully!");
}

sendTestEmail().catch(console.error);
```

Replace `your-email@gmail.com` with your actual Gmail address associated with the service account, and `recipient@example.com` with the email address of your recipient.

## Next Steps

You're now ready to explore more features of `gmail-node-mailer`, such as sending HTML emails, handling new subscriptions, and more. Check out the [Usage](#) and [Features](#) sections for detailed examples and capabilities.

---

For further assistance or more detailed examples, refer to the [full documentation](#).

[Back to main README](README.md)

---
