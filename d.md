
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

## Effortless Email Composition with Auto-Detection

When crafting emails with `gmail-node-mailer`, you don't need to worry about the intricacies of email formatting or subject encoding. Our intelligent auto-detection feature takes care of it all, making the process super easy and straightforward for you. Here's how:

### Subject Auto-Encoding
- **Automatic Detection**: The function automatically detects whether your subject line is encoded. If it isn't, it encodes the subject for you, ensuring compatibility across all email clients.
- **Seamless Experience**: You simply provide the subject, and we handle the rest. Whether it's plain text or needs encoding, your subject line will be perfectly formatted.

### HTML or Text Message Auto-Detection
- **Content Flexibility**: Write your message in plain text or HTML — `gmail-node-mailer` automatically detects the format.
- **Smart Handling**: For HTML content, the function wraps your message in the appropriate MIME type, ensuring it displays correctly in the recipient's email client. For plain text, it's sent as is, maintaining the simplicity of your message.

With `gmail-node-mailer`, sending emails is as easy as writing a message and hitting send. The auto-detection features ensure that your emails are always correctly formatted, whether you're sending a quick update or a beautifully designed newsletter.

```typescript
{
  sendMailResult: {
    sent: true,
    status: 200,
    statusText: 'OK',
    responseUrl: 'https://gmail.googleapis.com/gmail/v1/users/me/messages/send',
    message: 'Email successfully sent to waleed@glitchgaming.us.',
    gmailResponse: {
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

Enjoy the simplicity and power of `gmail-node-mailer`, where sending emails is made super easy, without compromising on flexibility or functionality.



## Advanced Initialization and Configuration

`gmail-node-mailer` offers a flexible and powerful way to initialize and configure your email sending capabilities. Here's a deep dive into how you can customize the initialization to fit your specific needs:

### Initializing with Service Account Credentials
The package allows you to authenticate using a Gmail service account for secure email sending. You can either directly provide the service account details or specify a file path to a JSON file containing these credentials.

```typescript
import { GmailMailer } from 'gmail-node-mailer';

const mailer = new GmailMailer();

// Initialize using direct service account details or a file path
await mailer.initializeClient({
  gmailServiceAccount: {client_email: '...', private_key: '...'},
  // OR
  gmailServiceAccountPath: './path/to/your-service-account.json',
});
```

### Configuring Sender Email
You can specify a default sender email address that validates its format to ensure emails are sent from a valid Gmail account.

```typescript
import { emailConfig } from 'gmail-node-mailer/utils/emailConfig';

// Set and validate the Gmail sender's email
emailConfig.setGmailSenderEmail('your-email@gmail.com');
```

### Auto-Detection of Subject Encoding and Message Format
`gmail-node-mailer` simplifies your workflow by auto-detecting whether your subject line needs MIME encoding and determining if your message is in plain text or HTML. This means you can focus on your message content without worrying about compatibility or formatting issues.

- **Subject Encoding**: If your subject line includes special characters or non-ASCII text, it's automatically encoded for you.
- **HTML or Text Messages**: Simply write your message, and `gmail-node-mailer` handles the rest. HTML messages are sent as multipart MIME messages, ensuring they render correctly across all email clients.

### Error Handling and Response Insights
Detailed error handling and response insights are provided, making it easy to debug and ensure your emails are sent successfully.

```typescript
try {
  const sendMailResult = await mailer.sendEmail({ ... });
  console.log(sendMailResult);
} catch (error) {
  console.error('Failed to send email:', error);
}
```

By leveraging these features, `gmail-node-mailer` ensures that sending emails through your Node.js applications is not only powerful but also incredibly easy and intuitive.
