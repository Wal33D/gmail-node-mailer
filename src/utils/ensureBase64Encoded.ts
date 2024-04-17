export function ensureBase64Encoded(data: string): string {
    const base64Pattern = /^(?:[A-Za-z0-9+\/]{4})*(?:[A-Za-z0-9+\/]{2}==|[A-Za-z0-9+\/]{3}=)?$/;
    return base64Pattern.test(data) ? data : Buffer.from(data).toString('base64');
}
