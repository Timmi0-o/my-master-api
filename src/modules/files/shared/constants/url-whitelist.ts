export const ALLOWED_FILE_URL_HOSTS = [
  'localhost',
  '127.0.0.1',
  'my-master-minio',
];

export function isAllowedFileUrl(fileUrl: string): boolean {
  try {
    if (fileUrl.startsWith('s3://')) {
      return true;
    }
    const url = new URL(fileUrl);
    if (ALLOWED_FILE_URL_HOSTS.includes(url.hostname)) {
      return true;
    }
    const privateIp =
      /^10\./.test(url.hostname) ||
      /^192\.168\./.test(url.hostname) ||
      /^172\.(1[6-9]|2\d|3[0-1])\./.test(url.hostname);
    return !privateIp;
  } catch {
    return false;
  }
}
