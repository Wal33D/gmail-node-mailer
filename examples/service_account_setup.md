## Service Account Setup

To use `gmail-node-mailer`, you also need to create a service account in the Google Cloud Console. Here's how:

1. **Create a Service Account**:
   - Navigate to **APIs & Services > Credentials**.
   - Click **+ Create Credentials** and select **Service account**.
   - Enter a name for your service account and select the role for the account (e.g., Project > Editor for full access to the project).
   - Click **Continue** and **Done**.
   - Your service account should now be created. Click on the newly created service account in the list.
   - Click **Add Key > Create new key**.
   - Select **JSON** as the key type and click **Create**.
   - The JSON file containing your credentials will be downloaded to your computer.

2. **Store your Service Account Key**:
   - Store the downloaded JSON file securely in your project directory.
   - Ensure that this file is not included in your version control system (e.g., add it to your `.gitignore` file).

3. **Grant the Service Account Access to the Gmail API**:
   - Go back to the [Google Cloud Console](https://console.cloud.google.com/).
   - Navigate to **APIs & Services > Library**.
   - Search for "Gmail API" and click on it.
   - Click **Enable** to enable the Gmail API for your project.
   - Ensure that the service account email address (found in the JSON file) has the necessary permissions to access the Gmail API. You can add this email address as a user with appropriate permissions in your Gmail settings if needed.

After completing these steps, your service account should be set up and ready to use with `gmail-node-mailer`.

[Back to main README](../README.md)
