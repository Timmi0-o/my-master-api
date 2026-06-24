export function parseS3Url(
  fileUrl: string,
): { bucket?: string; key: string } | undefined {
  const url = new URL(fileUrl);

  if (url.protocol === 's3:') {
    return {
      bucket: url.hostname,
      key: url.pathname.startsWith('/') ? url.pathname.slice(1) : url.pathname,
    };
  }

  if (url.protocol.startsWith('http')) {
    const pathParts = url.pathname.split('/').filter((part) => part.length > 0);
    if (pathParts.length > 1) {
      return {
        bucket: pathParts[0],
        key: pathParts.slice(1).join('/'),
      };
    }
    if (pathParts.length === 1) {
      return {
        bucket: undefined,
        key: pathParts[0],
      };
    }
  }

  return undefined;
}
