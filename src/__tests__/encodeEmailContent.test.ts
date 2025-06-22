import { encodeEmailContent } from '../utils/encodeEmailContent';
import { EncodingType } from '../types';

describe('encodeEmailContent', () => {
  test('encodes subject content', () => {
    const res = encodeEmailContent({ content: 'Hello', type: EncodingType.Subject });
    expect(res.isEncoded).toBe(true);
    expect(res.encodedContent).toBe('=?utf-8?B?SGVsbG8=?=');
  });

  test('encodes MIME message as URL safe base64', () => {
    const res = encodeEmailContent({ content: 'plain text', type: EncodingType.MimeMessage });
    const expected = Buffer.from('plain text', 'utf-8').toString('base64').replace(/\+/g, '-').replace(/\//g, '_');
    expect(res.isEncoded).toBe(true);
    expect(res.encodedContent).toBe(expected);
  });

  test('encodes attachment when not already base64', () => {
    const text = 'hello world';
    const res = encodeEmailContent({ content: text, type: EncodingType.Attachment });
    const expected = Buffer.from(text, 'utf-8').toString('base64');
    expect(res.isEncoded).toBe(true);
    expect(res.encodedContent).toBe(expected);
  });

  test('keeps attachment content when already base64', () => {
    const base64 = Buffer.from('foo').toString('base64');
    const res = encodeEmailContent({ content: base64, type: EncodingType.Attachment });
    expect(res.isEncoded).toBe(true);
    expect(res.encodedContent).toBe(base64);
    expect(res.message).toMatch('already Base64 encoded');
  });

  test('returns error for invalid type', () => {
    const res = encodeEmailContent({ content: 'test', type: 'bad-type' as any });
    expect(res.isEncoded).toBe(false);
    expect(res.encodedContent).toBe('test');
    expect(res.message).toMatch('Invalid encoding type');
  });
});
