
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

[Back to main README](README.md)

---
