
# Handling New Subscriptions Example

This example shows how to send personalized welcome emails to new subscribers.

```typescript
// handleNewSubscription.js
import { GmailMailer } from 'gmail-node-mailer';

export async function handleNewSubscription(customerEmail, subscriptionDetails) {
  const mailer = new GmailMailer();
  await mailer.initializeClient({
    gmailServiceAccountPath: './path/to/your-service-account.json',
  });

  const htmlMessage = `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f0f0f0; }
            .content { background-color: #fff; padding: 20px; }
            h1 { color: #007bff; }
        </style>
    </head>
    <body>
        <div class="content">
            <h1>Welcome to Your New Adventure!</h1>
            <p>Dear Adventurer, thank you for joining us. Your journey starts now!</p>
            <!-- Add more personalized content here -->
        </div>
    </body>
    </html>
  `;

  await mailer.sendEmail({
    senderEmail: process.env.GMAIL_MAILER_SENDER,
    recipientEmail: customerEmail,
    subject: '🎉 Welcome to Your New Adventure!',
    message: htmlMessage,
  });
}
```

### Notes

- Make sure to replace `'./path/to/your-service-account.json'` with the actual path to your service account JSON file.
- Don't forget to set `process.env.GMAIL_MAILER_SENDER` to your Gmail user.

For more detailed information, refer to the official documentation.
