import { detectHtml } from '../utils/detectHtml';

describe('detectHtml', () => {
  test('detects html content', () => {
    const res = detectHtml({ content: '<p>Hello</p>' });
    expect(res.isHtml).toBe(true);
    expect(res.message).toMatch('HTML content detected');
  });

  test('returns false for plain text', () => {
    const res = detectHtml({ content: 'Hello' });
    expect(res.isHtml).toBe(false);
    expect(res.message).toMatch('No HTML content detected');
  });

  test('handles regex errors gracefully', () => {
    const spy = jest.spyOn(RegExp.prototype, 'test').mockImplementation(() => { throw new Error('regex failure'); });
    const res = detectHtml({ content: '<p>Error</p>' });
    expect(res.isHtml).toBe(false);
    expect(res.message).toMatch('regex failure');
    spy.mockRestore();
  });
});
