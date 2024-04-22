@ -0,0 +1,78 @@
# Gmail Node Mailer Test Server

## Overview
This project demonstrates the capabilities of the `gmail-node-mailer` package by providing a Node.js/Express server application that can send various types of emails. Examples include HTML emails, plain text emails, emails with attachments, and more, using Gmail as the email service.

## Features
- **HTML Emails:** Send stylized HTML content to showcase formatting capabilities.
- **Plain Text Emails:** Efficiently send simple text-based emails.
- **Emails with Attachments:** Demonstrate how to attach files like PDFs and text files to emails.
- **Lifecycle Emails:** Automate sending emails for server status notifications and user subscription events.

## Prerequisites
- Node.js (v18.18.2 or later)
- npm or Yarn
- A Gmail account with access to Gmail API
- Google Cloud service account with the appropriate permissions to send emails through Gmail

## Installation

1. Clone the repository:
   ```bash
   git clone https://your-repository-url.git
   cd gmail-node-mailer-test-server
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Configure your environment variables:
   Create a `.env` file in the root directory and update it with your Gmail API credentials and server settings:
   ```plaintext
   DEFAULT_URL=http://localhost:6338
   GMAIL_MAILER_SENDER_EMAIL=your-email@example.com
   GMAIL_MAILER_SERVICE_ACCOUNT_PATH=./path/to/your/serviceAccount.json
   ```

## Usage

### Running the Server
- Start the server in development mode:
  ```bash
  yarn dev
  # or
  npm run dev
  ```

- Access the server at [http://localhost:6338](http://localhost:6338).

### Sending Emails
Access the predefined routes via your web browser or API tool to send different types of emails:
- **HTML Email:** `/send-html-email`
- **Plain Text Email:** `/send-plain-text-email`
- **Email with Attachments:** `/send-html-email-attachment`
- **Subscription Renewal:** `/send-subscription-renewal`
- **New Purchase Email:** `/send-new-purchase`

### Simulating Server Status Notifications
- **Simulate Server Status:** `/simulate-server-status`

## Development

- Run the build process:
  ```bash
  yarn build
  # or
  npm run build
  ```

- Clean the build directory:
  ```bash
  yarn clean
  # or
  npm run clean
  ```
![Demo Server](https://github.com/Wal33D/gmail-node-mailer-example-server/raw/main/images/demoServer.png "This Server")
