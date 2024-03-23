// Assuming this mock setup is already provided at the top of your test file

import { GmailMailer } from '../GmailMailer';
import { ISendEmailParams } from '../types'; // Ensure the path is correct

describe('GmailMailer', () => {
  let mockGmailClient: any; // You can type this more strictly if you prefer

  beforeEach(() => {
    // Setup the mockGmailClient with the necessary mocked functions
    mockGmailClient = {
      users: {
        messages: {
          send: jest.fn().mockResolvedValue({ status: 200, data: { id: '123', labelIds: ['SENT'] } }),
        },
      },
    };
  });

  describe('initializeClient', () => {
    it('should initialize the Gmail client successfully', async () => {
      const mockServiceAccount = {
        client_email: 'test@example.com',
        private_key: '-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n',
      };

      await expect(gmailMailer.initializeClient({
        gmailServiceAccount: mockServiceAccount,
        gmailSenderEmail: 'sender@example.com',
      })).resolves.toEqual({
        status: true,
        gmailClient: expect.anything(),
        message: "Successfully initialized the Gmail API client."
      });
    });
  });

  describe('sendEmailWrapper', () => {
    it('should send an email successfully', async () => {
      const gmailMailer = new GmailMailer(mockGmailClient); // Inject the mock

      const emailParams: ISendEmailParams = {
        senderEmail: 'sender@example.com', // This should match what's used in initialization
        recipientEmail: 'recipient@example.com',
        subject: 'Test Subject',
        message: 'This is a test email.',
      };

      await expect(gmailMailer.sendEmailWrapper(emailParams)).resolves.toEqual({
        status: true,
        message: "Email successfully sent to recipient@example.com.",
      });
    });
  });
});
