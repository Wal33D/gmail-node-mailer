import { promises as fsPromises } from 'fs';
import * as path from 'path';
import * as os from 'os';
import { parseServiceAccountFile } from '../utils/parseServiceAccountFile';
import { IParseServiceAccountResult } from '../types';

describe('parseServiceAccountFile', () => {
  test('should parse a valid service account file', async () => {
    const tmpDir = await fsPromises.mkdtemp(path.join(os.tmpdir(), 'sa-'));
    const filePath = path.join(tmpDir, 'service.json');
    const serviceAccount = { private_key: 'key', client_email: 'client@example.com' };
    await fsPromises.writeFile(filePath, JSON.stringify(serviceAccount), 'utf-8');

    const result: IParseServiceAccountResult = await parseServiceAccountFile({ filePath });

    expect(result.status).toBe(true);
    expect(result.serviceAccount).toEqual(serviceAccount);
    expect(typeof result.message).toBe('string');

    await fsPromises.rm(tmpDir, { recursive: true, force: true });
  });

  test('should handle missing file', async () => {
    const tmpDir = await fsPromises.mkdtemp(path.join(os.tmpdir(), 'sa-'));
    const filePath = path.join(tmpDir, 'missing.json');

    const result: IParseServiceAccountResult = await parseServiceAccountFile({ filePath });

    expect(result.status).toBe(false);
    expect(result.serviceAccount).toBeUndefined();
    expect(result.message).toContain('File not found');

    await fsPromises.rm(tmpDir, { recursive: true, force: true });
  });
});
