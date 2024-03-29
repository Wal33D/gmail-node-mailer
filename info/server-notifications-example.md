# Server Start/Stop Notifications Example

This example demonstrates how to send notifications when your server starts or stops using `gmail-node-mailer` with a globally accessible GmailMailer instance in a Node.js environment.

```typescript
import { GmailMailer } from 'gmail-node-mailer';

// Assuming global.gmailClient is declared somewhere globally accessible within your application.
declare global {
  namespace NodeJS {
    interface Global {
      gmailClient: GmailMailer;
    }
  }
}

async function initializeMailer() {
  const mailer = new GmailMailer();
  await mailer.initializeClient({
    gmailServiceAccountPath: './path/to/your-service-account.json',
  });

  // Setting the initialized mailer to a global variable
  global.gmailClient = mailer;
}

async function notifyServerStatus(status: 'start' | 'stop') {
  const message = status === 'start' ? 'Server is up and running.' : 'Server has been shut down.';
  try {
    await global.gmailClient.sendEmail({
      senderEmail: "sender@example.com", // Or use process.env.GMAIL_MAILER_SENDER_EMAIL if configured
      recipientEmail: 'admin@example.com',
      subject: `Server ${status} Notification`,
      message,
    });
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

// Initialize the GmailMailer client and then notify server status
initializeMailer().then(() => {
  notifyServerStatus('start').catch(console.error);
});

// Further down in your server code, you can use global.gmailClient for other email sending purposes
```