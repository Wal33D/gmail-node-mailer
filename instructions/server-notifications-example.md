
# Server Start/Stop Notifications Example

This example demonstrates how to send notifications when your server starts or stops.

```typescript
import { GmailMailer } from 'gmail-node-mailer';

const mailer = new GmailMailer();

async function notifyServerStatus(status) {
  await mailer.initializeClient({
    gmailServiceAccountPath: './path/to/your-service-account.json',
  });

  const message = status === 'start' ? 'Server is up and running.' : 'Server has been shut down.';
  await mailer.sendEmail({
    senderEmail: process.env.GMAIL_USER,
    recipientEmail: 'admin@example.com',
    subject: `Server ${status} Notification`,
    message,
  });
}

notifyServerStatus('start').catch(console.error);
```

### Notes

- Make sure to replace `'./path/to/your-service-account.json'` with the actual path to your service account JSON file.
- Don't forget to set `process.env.GMAIL_USER` to your Gmail user.

For more detailed information, refer to the official documentation.
