import { GmailMailer } from '../GmailMailer';
import { ISendEmailParams } from '../types'; // Ensure the path is correct

// Define mockGmailClient with the mocked send function
const mockGmailClient = {
  users: {
    messages: {
      send: jest.fn().mockResolvedValue({
        status: 200,
        data: { id: '123', labelIds: ['SENT'] },
      }),
    },
  },
};

describe('GmailMailer', () => {
  describe('initializeClient', () => {
    it('should initialize the Gmail client successfully', async () => {
      const gmailMailer = new GmailMailer(mockGmailClient); // Use the mock client
      const mockServiceAccount = {
        client_email: 'test@example.com',
        private_key: `-----BEGIN PRIVATE KEY-----\\n...\\n-----END PRIVATE KEY-----\\n`,
      };

      await expect(
        gmailMailer.initializeClient({
          gmailServiceAccount: mockServiceAccount,
          gmailSenderEmail: 'sender@example.com',
        })
      ).resolves.toEqual({
        status: true,
        gmailClient: expect.anything(),
        message: 'Successfully initialized the Gmail API client.',
      });
    });
  });

  describe('sendEmailWrapper', () => {
    it('should send an email successfully', async () => {
      // Initialize GmailMailer with the mocked Gmail client
      const gmailMailer = new GmailMailer(mockGmailClient);

      const emailParams: ISendEmailParams = {
        // Assuming senderEmail is optional and can use a default or previously set value
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
