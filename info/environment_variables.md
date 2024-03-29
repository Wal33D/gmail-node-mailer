
## Environment Configuration for `gmail-node-mailer`

To seamlessly integrate `gmail-node-mailer` into your Node.js project, you must configure certain environment variables. These variables facilitate the authentication process with the Gmail API and define the sender's email address.

### Required Environment Variables

- **`GMAIL_MAILER_SENDER_EMAIL`**: Specifies the email address used as the sender for outgoing emails. Ensure this email address has access to the Gmail API and is allowed to send emails on behalf of your service account.

    ```plaintext
    GMAIL_MAILER_SENDER_EMAIL=no-reply@somnuslabs.com
    ```

### Optional Environment Variables for Service Account Configuration

Depending on your environment (development or production), you can choose to specify your service account credentials via a file path or directly as an environment variable:

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

This flexible approach ensures `gmail-node-mailer` can be easily configured to work in various environments, simplifying the transition from development to production.

By leveraging these features, `gmail-node-mailer` ensures that sending emails through your Node.js applications is not only powerful but also incredibly easy and intuitive.
