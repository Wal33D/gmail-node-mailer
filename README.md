# Gmail Node Mailer

Simplify your email sending process within Node.js applications with `gmail-node-mailer`. This lightweight package harnesses the power of the Gmail API to send emails effortlessly. Whether you're sending a quick notification or a detailed newsletter, `gmail-node-mailer` makes it straightforward.

**GitHub Repository:** [gmail-node-mailer on GitHub](https://github.com/our-node-packages/gmail-node-mailer)

**npm Package:** [gmail-node-mailer on npm](https://www.npmjs.com/package/gmail-node-mailer)

## Quick Features
- 🚀 Quick setup with service account credentials.
- 📧 Validate and send emails with ease.
- 🎨 Supports both plain text and HTML content.
- 🔧 Easy configuration for service accounts and sender emails.
- 📎 **New Functionality: Attachment Support** - Send attachments with your emails effortlessly.

## Requirements

- Node.js **14** or newer

## Get Started in Seconds

### 1. Install with NPM

Run the following in your project directory:

```bash
npm install gmail-node-mailer
```

### 2. Streamline Email Notifications with Your Server Workflow

`gmail-node-mailer` is designed to seamlessly integrate into your server setup, enabling you to send emails for various events such as server start/stop notifications, error alerts, and to manage subscription events like new subscriptions or renewals.

## Detailed Usage Guide
### Sending Emails with Attachments

With the new attachment support, `gmail-node-mailer` allows you to include files in your emails. Here's how you can attach a PDF file to an email:

```typescript
import { GmailMailer } from 'gmail-node-mailer';

async function sendEmailWithAttachment() {
  const mailer = new GmailMailer();
  await mailer.initializeClient({
    gmailSenderEmail:'example@your-domain.com',
    gmailServiceAccountPath: './path/to/your-service-account.json',
  });
    const attachments = [{
        filename: 'Invoice.pdf',
        mimeType: 'application/pdf',
        content: 'base64_encoded_content_here'
    }];

    await mailer.sendEmail({
        recipientEmail: 'customer@example.com',
        subject: 'Your Invoice',
        message: 'Please find attached your invoice.',
        attachments: attachments
    });
}

sendEmailWithAttachment().catch(console.error);
```

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
### Use Case Examples 
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
Check the examples directory for more samples.

## Advanced Initialization and Configuration

`gmail-node-mailer` offers a flexible and powerful way to initialize and configure your email sending capabilities. Here's a deep dive into customizing the initialization:

### Initializing with Service Account Credentials

Authenticate using a Gmail service account for secure email sending. To do this, you need to initialize the `GmailMailer` with your service account details. 
This can be done by either directly providing the service account details or specifying a file path to a JSON file containing these credentials. 
Here's how you can accomplish this:

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
import { validateEmailAddress } from 'gmail-node-mailer/utils/validateEmailAddress';

// Set and validate the Gmail sender's email, or optionally declare the GMAIL_MAILER_SENDER_EMAIL in your .env file
emailConfig.setGmailSenderEmail('your-email@gmail.com');

const { status, result } = validateEmailAddress({ email: 'your-email@gmail.com' });

if (!status || !result) {
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


### HTML or Plain Text Auto-Detection
Automatically encodes the subject line ensuring compatibility across all email clients.
Write your message in either format, and `gmail-node-mailer` will handle the rest, ensuring it's correctly formatted.
To enhance clarity and consistency in the readme section for environment configuration, consider the revised version below:

---

## Environment Configuration for `gmail-node-mailer`

To ensure smooth integration of `gmail-node-mailer` into your Node.js project, it's crucial to configure the environment variables detailed below. These variables can be set directly in your environment or passed during the instantiation of `gmail-node-mailer`.

### Optional Environment Variables for Service Account Configuration

Configure the following optional environment variables for detailed control over service account usage:

- **`GMAIL_MAILER_SENDER_EMAIL`**: Defines the email address from which emails will be sent.

- **`GMAIL_MAILER_SERVICE_ACCOUNT`**: In scenarios such as production environments or instances where direct file access is not feasible, this variable allows you to input your service account credentials as a JSON string within an environment variable. 

  Example usage:
  ```plaintext
  GMAIL_MAILER_SERVICE_ACCOUNT={"type":"service_account","project_id":"...","private_key_id":"...","private_key":"-----BEGIN PRIVATE KEY-----\\n...\\n-----END PRIVATE KEY-----\\n","client_email":"....iam.gserviceaccount.com","client_id":"...","auth_uri":"...","token_uri":"...","auth_provider_x509_cert_url":"...","client_x509_cert_url":"..."}
  ```
  **Note**: Ensure that special characters within the JSON (e.g., newlines in the private key) are properly escaped. While this example aims for readability, real-world usage might require meticulous JSON formatting or escaping.

- **`GMAIL_MAILER_SERVICE_ACCOUNT_PATH`**: Primarily for development environments, this variable designates the path to the local JSON file containing your service account credentials. 

  Example usage:
  ```plaintext
  GMAIL_MAILER_SERVICE_ACCOUNT_PATH=./private/somnus_gmail_service_account.json
  ```
  **Note**: Verify that the specified path is accurate, relative to your project's root directory.

### Sample `.env`

```env
GMAIL_MAILER_SENDER_EMAIL=sender@example.com
# Path to your local service account JSON
GMAIL_MAILER_SERVICE_ACCOUNT_PATH=./path/to/service-account.json
# Or provide the service account JSON directly
# GMAIL_MAILER_SERVICE_ACCOUNT={"type":"service_account",...}
```

## Additional Information and Examples

For more detailed information on configuring `gmail-node-mailer`, including setting up environment variables, sample code, please refer to the following documents in the `/info` directory:

- [Environment Variables Setup](https://github.com/our-node-packages/gmail-node-mailer/blob/master/info/environment_variables.md): A guide on setting up and using the `GMAIL_MAILER_SERVICE_ACCOUNT_PATH` and `GMAIL_MAILER_SERVICE_ACCOUNT` variables for development and production environments.

- [Handling New Subscriptions Example](https://github.com/our-node-packages/gmail-node-mailer/blob/master/info/handling-new-subscriptions-example.md): An example script showing how to integrate `gmail-node-mailer` for handling new subscription notifications.

- [sendEmail Function Types](https://github.com/our-node-packages/gmail-node-mailer/blob/master/info/sendEmail_function_types.md): Documentation on the `sendEmail` function, including parameters and expected results.

- [Server Notifications Example](https://github.com/our-node-packages/gmail-node-mailer/blob/master/info/server-notifications-example.md): A detailed example on setting up server start/stop notifications using `gmail-node-mailer`.

- [Service Account Setup](https://github.com/our-node-packages/gmail-node-mailer/blob/master/info/service_account_setup.md): Step-by-step instructions on setting up a Gmail service account for use with `gmail-node-mailer`.

## License

This project is licensed under the [GNU Lesser General Public License v3.0](LICENSE).
