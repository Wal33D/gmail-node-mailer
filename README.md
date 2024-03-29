
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

### 2. Initialize and Send

Initialize the Gmail API client and send your first email in just a few lines of code:

```typescript
import { GmailMailer } from 'gmail-node-mailer';

async function sendYourFirstEmail() {
  const mailer = new GmailMailer();

  // Initialize with service account
  await mailer.initializeClient({
    gmailServiceAccountPath: './path/to/your-service-account.json',
  });

  // Craft your email
  await mailer.sendEmail({
    senderEmail: 'you@example.com',
    recipientEmail: 'friend@example.com',
    subject: 'Hello from Gmail Node Mailer',
    message: 'Sending emails has never been simpler.',
  });

  console.log("Email sent successfully!");
}

sendYourFirstEmail().catch(console.error);
```

## Simplify Your Email Workflow

**Configure Once, Use Everywhere**: Set your service account and sender email once, and focus on what matters - your message content.

**No Complicated Setups**: `gmail-node-mailer` abstracts away the complexities, letting you send emails without sweating the small stuff.

**Flexibility at Your Fingertips**: Whether you're sending plain text or rich HTML content, `gmail-node-mailer` has got you covered.

## Join the Community

Got ideas or need help? Your contributions and questions are welcome! Feel free to open an issue on our [GitHub repository](#).

## License

`gmail-node-mailer` is proudly distributed under the MIT License. Feel free to use it in your projects as you see fit.
