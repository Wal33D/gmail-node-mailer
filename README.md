
# Gmail Node Mailer

Simplify your email sending process within Node.js applications with `gmail-node-mailer`. This lightweight package harnesses the power of the Gmail API to send emails effortlessly. Whether you're sending a quick notification or a detailed newsletter, `gmail-node-mailer` makes it straightforward.

## Quick Features

- 🚀 Quick setup with service account credentials.
- 📧 Validate and send emails with ease.
- 🎨 Supports both plain text and HTML content.
- 🔧 Easy configuration for service accounts and sender emails.

## Get Started in Seconds

### 1. Install with NPM

Run the following in your project directory:

```bash
npm install gmail-node-mailer
```

### 2. Streamline Email Notifications with Your Server Workflow

`gmail-node-mailer` is designed to seamlessly integrate into your server setup, enabling you to send emails for various events such as server start/stop notifications, error alerts, and to manage subscription events like new subscriptions or renewals. Here's how you can utilize it in real-world scenarios:

#### Server Start/Stop Notifications

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

#### Handling New Subscriptions and Renewals

Integrate subscription handling in your payment system (e.g., Stripe) to send personalized welcome emails or renewal confirmations:

```typescript
// handleNewSubscription.js
import { GmailMailer } from 'gmail-node-mailer';

export async function handleNewSubscription(customerEmail, subscriptionDetails) {
  const mailer = new GmailMailer();
  await mailer.initializeClient({
    gmailServiceAccountPath: './path/to/your-service-account.json',
  });

  // Customize your message based on subscription details
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
    senderEmail: process.env.GMAIL_USER,
    recipientEmail: customerEmail,
    subject: '🎉 Welcome to Your New Adventure!',
    message: htmlMessage,
  });
}

// handleSubscriptionRenewal.js
export async function handleSubscriptionRenewal(customerEmail, renewalDetails) {
  // Similar to handleNewSubscription but with a message tailored to renewals
}
```


## Handling Responses and Results

When you use `gmail-node-mailer` to send an email, the response you receive provides detailed information about the operation's success and the email sending process. Here's an overview of the structure you can expect in the response:

```typescript
{
  sendMailResult: {
    sent: true,
    status: 200,
    statusText: 'OK',
    responseUrl: 'https://gmail.googleapis.com/gmail/v1/users/me/messages/send',
    message: 'Email successfully sent to waleed@glitchgaming.us.',
    gmailResponse: {
      // Response includes configuration used for the request, data returned by Gmail API,
      // headers from the response, status code, and status text.
      config: [Object],
      data: [Object],
      headers: [Object],
      status: 200,
      statusText: 'OK',
      request: [Object]
    }
  }
}
```