import * as fs from 'fs';
import * as path from 'path';
import { parseServiceAccountFile } from '../utils/parseServiceAccountFile';
import { IParseServiceAccountResult } from '../types';

describe('parseServiceAccountFile', () => {
  const tempDir = path.join(__dirname, 'tmp');

  beforeAll(() => {
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);
  });

  afterAll(() => {
    if (fs.existsSync(tempDir)) fs.rmSync(tempDir, { recursive: true, force: true });
  });

  test('loads valid service account file', async () => {
    const filePath = path.join(tempDir, 'valid.json');
    const content = { private_key: 'key', client_email: 'test@example.com' };
    fs.writeFileSync(filePath, JSON.stringify(content));

    const res: IParseServiceAccountResult = await parseServiceAccountFile({ filePath });
    expect(res.status).toBe(true);
    expect(res.serviceAccount).toEqual(content);
  });

  test('returns error when file missing', async () => {
    const filePath = path.join(tempDir, 'missing.json');
    const res: IParseServiceAccountResult = await parseServiceAccountFile({ filePath });
    expect(res.status).toBe(false);
    expect(res.message).toMatch('File not found');
  });

  test('returns error for invalid json', async () => {
    const filePath = path.join(tempDir, 'invalid.json');
    fs.writeFileSync(filePath, '{invalid json');
    const res: IParseServiceAccountResult = await parseServiceAccountFile({ filePath });
    expect(res.status).toBe(false);
    expect(res.message).toMatch('invalid JSON');
  });

  test('returns error for missing fields', async () => {
    const filePath = path.join(tempDir, 'missingFields.json');
    fs.writeFileSync(filePath, JSON.stringify({ client_email: 'only@example.com' }));
    const res: IParseServiceAccountResult = await parseServiceAccountFile({ filePath });
    expect(res.status).toBe(false);
    expect(res.message).toMatch("lacks required 'private_key' or 'client_email'");
  });

  test('result matches IParseServiceAccountResult shape', async () => {
    const filePath = path.join(tempDir, 'shape.json');
    const content = { private_key: 'key', client_email: 'shape@example.com' };
    fs.writeFileSync(filePath, JSON.stringify(content));

    const res = await parseServiceAccountFile({ filePath });
    const keys = Object.keys(res).sort();
    expect(keys).toEqual(['message', 'serviceAccount', 'status']);
  });
});
