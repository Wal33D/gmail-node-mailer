## Gmail API Setup

To use `gmail-node-mailer`, you first need to enable the Gmail API. Here's how:

1. **Enable the Gmail API**:
   - Visit the [Google Cloud Console](https://console.cloud.google.com/).
   - Create a new project or select an existing one.
   - Navigate to **APIs & Services > Dashboard**.
   - Click **+ ENABLE APIS AND SERVICES**.
   - Search for "Gmail API" and enable it for your project.

## Service Account Setup

To use `gmail-node-mailer`, you also need to create a service account in the Google Cloud Console. Here's how:

1. **Create a Service Account**:
   - Navigate to **APIs & Services > Credentials**.
   - Click **+ Create Credentials** and select **Service account**.
   - Follow the on-screen instructions to create a service account.
   - Download the JSON file containing your credentials.

## Use the Alias in gmail-node-mailer (Optional)

In your `gmail-node-mailer` configuration, use the alias email address as the `from` field when sending emails. Ensure that the alias email address is verified in your Gmail settings.

---

After enabling the Gmail API and obtaining your service account credentials, you can proceed to install and set up `gmail-node-mailer`.

[Back to main README](README.md)
