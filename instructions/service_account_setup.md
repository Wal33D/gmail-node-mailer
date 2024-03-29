## Gmail API Setup

To use `gmail-node-mailer`, you first need to enable the Gmail API. Here's how:

1. **Enable the Gmail API**:
   - Visit the [Google Cloud Console](https://console.cloud.google.com/).
   - Create a new project or select an existing one.
   - Navigate to **APIs & Services > Dashboard**.
   - Click **+ ENABLE APIS AND SERVICES**.
   - Search for "Gmail API" and click on it.

2. **Enable the API for Your Project**:
   - Click **ENABLE** to enable the Gmail API for your project.

3. **Create a Service Account** (if you haven't already):
   - Navigate to **APIs & Services > Credentials**.
   - Click **+ Create Credentials** and select **Service account**.
   - Enter a name for your service account and select the role for the account (e.g., Project > Editor for full access to the project).
   - Click **Continue** and **Done**.
   - Your service account should now be created. Click on the newly created service account in the list.
   - Click **Add Key > Create new key**.
   - Select **JSON** as the key type and click **Create**.
   - The JSON file containing your credentials will be downloaded to your computer.

4. **Grant the Service Account Access to the Gmail API**:
   - Go back to the [Google Cloud Console](https://console.cloud.google.com/).
   - Navigate to **APIs & Services > Library**.
   - Search for "Gmail API" and click on it.
   - Click **Enable** to enable the Gmail API for your project.
   - Ensure that the service account email address (found in the JSON file) has the necessary permissions to access the Gmail API. You can add this email address as a user with appropriate permissions in your Gmail settings if needed.

5. **Use the Service Account in Your Application**:
   - Use the downloaded JSON file containing your service account credentials in your application to authenticate with the Gmail API using `gmail-node-mailer`.

After completing these steps, your service account should be set up and ready to use with `gmail-node-mailer`.

[Back to main README](README.md)
