import { sendEmailFunction } from '../functions/sendEmail';
import { encodeEmailContent } from '../utils/encodeEmailContent';

jest.mock('../utils/encodeEmailContent');

describe('sendEmailFunction', () => {
  const mockSend = jest.fn();
  const gmailClient: any = { users: { messages: { send: mockSend } } };

  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('sends email successfully', async () => {
    mockSend.mockResolvedValue({ status: 200, statusText: 'OK' });
    (encodeEmailContent as jest.Mock).mockImplementation(({ content }) => ({ isEncoded: true, encodedContent: Buffer.from(content).toString('base64'), message: '' }));

    const res = await sendEmailFunction(gmailClient, { senderEmail: 'sender@example.com', senderName: 'Sender', recipientEmail: 'to@example.com', subject: 'Hi', message: 'hello' });

    expect(mockSend).toHaveBeenCalledTimes(1);
    expect(res.sent).toBe(true);
    expect(res.message).toMatch('Email successfully sent to to@example.com');
  });

  test('handles gmail api failure', async () => {
    mockSend.mockRejectedValue(new Error('api fail'));
    (encodeEmailContent as jest.Mock).mockReturnValue({ isEncoded: true, encodedContent: 'abc', message: '' });

    const res = await sendEmailFunction(gmailClient, { senderEmail: 'sender@example.com', recipientEmail: 'to@example.com', message: 'body' });
    expect(res.sent).toBe(false);
    expect(res.message).toMatch('api fail');
  });

  test('handles encoding failure', async () => {
    mockSend.mockResolvedValue({ status: 200 });
    (encodeEmailContent as jest.Mock).mockReturnValue({ isEncoded: false, encodedContent: '', message: 'fail' });

    const res = await sendEmailFunction(gmailClient, { senderEmail: 'sender@example.com', recipientEmail: 'to@example.com', message: 'body' });

    expect(mockSend).not.toHaveBeenCalled();
    expect(res.sent).toBe(false);
    expect(res.message).toMatch('Failed to encode MIME message');
  });
});
