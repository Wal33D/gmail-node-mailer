# Gmail Node Mailer

Simplify your email sending process within Node.js applications with `gmail-node-mailer`. This lightweight package harnesses the power of the Gmail API to send emails effortlessly. Whether you're sending a quick notification or a detailed newsletter, `gmail-node-mailer` makes it straightforward.

**GitHub Repository:** [gmail-node-mailer on GitHub](https://github.com/our-node-packages/gmail-node-mailer)

**npm Package:** [gmail-node-mailer on npm](https://www.npmjs.com/package/gmail-node-mailer)

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

`gmail-node-mailer` is designed to seamlessly integrate into your server setup, enabling you to send emails for various events such as server start/stop notifications, error alerts, and to manage subscription events like new subscriptions or renewals.

## Detailed Usage Guide

### Server Start/Stop Notifications

Seamlessly notify about server start or stop events using `gmail-node-mailer`. Here's an example on how to set up and send these notifications:

```typescript
import { GmailMailer } from 'gmail-node-mailer';

async function initializeMailer() {
  const mailer = new GmailMailer();
  await mailer.initializeClient({
    gmailSenderEmail:'example@your-domain.com',
    gmailServiceAccountPath: './path/to/your-service-account.json',
  });
  // Setting the initialized mailer to a global variable
  global.gmailClient = mailer;
}

async function notifyServerStatus(status: 'start' | 'stop') {
  const message = status === 'start' ? 'Server is up and running.' : 'Server has been shut down.';
  try {
    await global.gmailClient.sendEmail({
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

This snippet demonstrates how to set up `gmail-node-mailer` for sending notifications related to server start and stop events. It involves initializing the `GmailMailer` client with the necessary service account credentials and then using it to send email notifications.
Certainly, here's a detailed example of how to handle new subscriptions and renewals with `gmail-node-mailer`. This example assumes you're integrating with a payment system like Stripe and want to send personalized emails upon new subscription sign-ups or subscription renewals.

```markdown
### Handling New Subscriptions and Renewals

Integrate subscription handling in your payment system to send personalized welcome emails or renewal confirmations. Utilizing `gmail-node-mailer`, you can automate the process of notifying customers about their subscription status, enhancing the overall customer experience. Below are examples for handling new subscriptions and renewals.

#### New Subscription Welcome Emails

When a new customer subscribes, sending a welcome email is a great way to start your relationship. Here's how you can set this up:

```typescript
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
        senderEmail: process.env.GMAIL_MAILER_SENDER_EMAIL,
        recipientEmail: customerEmail,
        subject: '🎉 Welcome to Your New Adventure!',
        message: htmlMessage,
    });
}
```

#### Subscription Renewal Confirmations

Similarly, for subscription renewals, sending a confirmation email reaffirms the customer's value to your service. Here's a sample approach:

```typescript
// Assuming the GmailMailer is initialized similarly as in the new subscription example

export async function handleSubscriptionRenewal(customerEmail, renewalDetails) {
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
                <h1>Your Adventure Continues!</h1>
                <p>Dear Adventurer, we're thrilled to have you with us for another year. Here's to more adventures together!</p>
                <!-- Add renewal-specific content here -->
            </div>
        </body>
        </html>
    `;

    // Use the initialized GmailMailer instance to send the email
    await mailer.sendEmail({
        senderEmail: process.env.GMAIL_MAILER_SENDER_EMAIL,
        recipientEmail: customerEmail,
        subject: '🎉 Thank You for Renewing Your Adventure!',
        message: htmlMessage,
    });
}
```

These examples showcase how to integrate `gmail-node-mailer` for sending dynamic, personalized emails for new subscriptions and renewals, enhancing your automated communication strategy.

## Advanced Initialization and Configuration

`gmail-node-mailer` offers a flexible and powerful way to initialize and configure your email sending capabilities. Here's a deep dive into customizing the initialization:

### Initializing with Service Account Credentials

Authenticate using a Gmail service account for secure email sending. To do this, you need to initialize the `GmailMailer` with your service account details. This can be done by either directly providing the service account details or specifying a file path to a JSON file containing these credentials. Here's how you can accomplish this:

```typescript
import { GmailMailer } from 'gmail-node-mailer';

const mailer = new GmailMailer();

// Initialize using direct service account details or a file path
await mailer.initializeClient({
  gmailServiceAccount: {
    client_email: 'your-service-account-email@your-project.iam.gserviceaccount.com',
    private_key: '-----BEGIN PRIVATE KEY-----\n...your-private-key...\n-----END PRIVATE KEY-----\n'
  },
  // OR
  gmailServiceAccountPath: './path/to/your-service-account.json',
});
```

### Configuring Sender Email

Specify and validate a default sender email address:

```typescript
import { emailConfig } from 'gmail-node-mailer/utils/emailConfig';

// Set and validate the Gmail sender's email
emailConfig.setGmailSenderEmail('your-email@gmail.com');

// Optionally, you could include a validation check to ensure the email is correctly formatted
// and meets specific criteria (this is a pseudo-code example for demonstration purposes)
if (!emailConfig.validateEmailFormat('your-email@gmail.com')) {
    console.error('Email format is invalid. Please use a valid Gmail address.');
} else {
    console.log('Sender email configured successfully.');
}

```
### example sendEmail function response --> 
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

## Effortless Email Composition with Auto-Detection

When crafting emails, `gmail-node-mailer` simplifies your workflow by auto-detecting email formatting and subject encoding.

### Subject Auto-Encoding

Automatically encodes the subject line ensuring compatibility across all email clients.

### HTML or Text Message Auto-Detection

Write your message in either format, and `gmail-node-mailer` will handle the rest, ensuring it's correctly formatted.

## Environment Configuration for `gmail-node-mailer`

To seamlessly integrate `gmail-node-mailer` into your Node.js project, configure the necessary environment variables.

### Required Environment Variables

- **`GMAIL_MAILER_SENDER_EMAIL`**: Specifies the sender's email address.

### Optional Environment Variables for Service Account Configuration

- **`GMAIL_MAILER_SERVICE_ACCOUNT_PATH`**: Used primarily in development environments, this variable points to the local JSON file containing your service account credentials.

    ```plaintext
    GMAIL_MAILER_SERVICE_ACCOUNT_PATH=./private/somnus_gmail_service_account.json
    ```

    Ensure the path is correctly specified relative to the root of your project.

- **`GMAIL_MAILER_SERVICE_ACCOUNT`**: In production environments, or when direct file access is restricted, you may opt to provide your service account credentials as a JSON string directly within an environment variable.

    ```plaintext
    GMAIL_MAILER_SERVICE_ACCOUNT={"type":"service_account","project_id":"...","private_key_id":"...","private_key":"-----BEGIN PRIVATE KEY-----\\n...\\n-----END PRIVATE KEY-----\\n","client_email":"....iam.gserviceaccount.com","client_id":"...","auth_uri":"...","token_uri":"...","auth_provider_x509_cert_url":"...","client_x509_cert_url":"...","universe_domain":"googleapis.com"}

    ```

    Note: Ensure special characters in the JSON (like newlines in the private key) are properly escaped. This example simplifies the actual process for readability; typically, you'll need to handle escaping or format the JSON appropriately.

### Choosing the Right Configuration

- For **development**, using the `GMAIL_MAILER_SERVICE_ACCOUNT_PATH` variable to reference a local file is often more convenient.
- For **production**, embedding the service account credentials directly in `GMAIL_MAILER_SERVICE_ACCOUNT` facilitates deployment in environments where file access may be limited.

By leveraging these features, `gmail-node-mailer` ensures that sending emails through your Node.js applications is not only powerful but also incredibly easy and intuitive.

## Additional Information and Examples

For more detailed information on configuring `gmail-node-mailer`, including setting up environment variables, handling new subscriptions, and examples of server notifications, please refer to the following documents in the `/info` directory:

- [Environment Variables Setup](https://github.com/our-node-packages/gmail-node-mailer/blob/master/info/environment_variables.md): A guide on setting up and using the `GMAIL_MAILER_SERVICE_ACCOUNT_PATH` and `GMAIL_MAILER_SERVICE_ACCOUNT` variables for development and production environments.

- [Handling New Subscriptions Example](https://github.com/our-node-packages/gmail-node-mailer/blob/master/info/handling-new-subscriptions-example.md): An example script showing how to integrate `gmail-node-mailer` for handling new subscription notifications.

- [sendEmail Function Types](https://github.com/our-node-packages/gmail-node-mailer/blob/master/info/sendEmail_function_types.md): Documentation on the `sendEmail` function, including parameters and expected results.

- [Server Notifications Example](https://github.com/our-node-packages/gmail-node-mailer/blob/master/info/server-notifications-example.md): A detailed example on setting up server start/stop notifications using `gmail-node-mailer`.

- [Service Account Setup](https://github.com/our-node-packages/gmail-node-mailer/blob/master/info/service_account_setup.md): Step-by-step instructions on setting up a Gmail service account for use with `gmail-node-mailer`.
