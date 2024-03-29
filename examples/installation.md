
# Gmail API Setup and `gmail-node-mailer` Installation

## Gmail API Setup

To use `gmail-node-mailer`, you first need to enable the Gmail API and create a service account in the Google Cloud Console. Here's how:

1. **Enable the Gmail API**:
   - Visit the [Google Cloud Console](https://console.cloud.google.com/).
   - Create a new project or select an existing one.
   - Navigate to **APIs & Services > Dashboard**.
   - Click **+ ENABLE APIS AND SERVICES**.
   - Search for "Gmail API" and enable it for your project.

2. **Create a Service Account**:
   - Navigate to **APIs & Services > Credentials**.
   - Click **+ Create Credentials** and select **Service account**.
   - Follow the on-screen instructions to create a service account.
   - Download the JSON file containing your credentials.

## Installation and Setup

After enabling the Gmail API and obtaining your service account credentials, you can proceed to install and set up `gmail-node-mailer`.

### Installation

1. **With NPM**

   Open your terminal, navigate to your project directory, and run:

   ```bash
   npm install gmail-node-mailer
   ```

### Initial Setup

Here's how to integrate `gmail-node-mailer` into your Node.js project:

1. **Import `GmailMailer`**

   Import `GmailMailer` into your script or application entry point.

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

   Here, `gmailServiceAccountPath` is the path to the JSON file you downloaded earlier.

```

Ensure `your-email@gmail.com` is associated with your service account or is an alias of a domain or secondary domain of your Google Project, and replace `recipient@example.com` with your recipient's email address.

---

This guide should help you get started with `gmail-node-mailer` smoothly. For more detailed examples and capabilities, explore the [Usage](#) and [Features](#) sections.

[Back to main README](README.md)

---
