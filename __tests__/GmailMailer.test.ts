import { GmailMailer } from '../src/GmailMailer';

describe('GmailMailer', () => {
    let gmailMailer: GmailMailer;

    beforeEach(() => {
        gmailMailer = new GmailMailer();
    });

    test('initializeClient should fail with invalid service account path', async () => {
        await expect(gmailMailer.initializeClient({ gmailServiceAccountPath: 'invalid/path.json' }))
            .rejects
            .toThrow('Failed to load service account');
    });

});
