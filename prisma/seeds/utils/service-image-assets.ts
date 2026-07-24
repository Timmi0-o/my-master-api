import { createHash } from 'crypto';
import { mkdir, readFile, writeFile } from 'fs/promises';
import path from 'path';
import { resolveFlickrSearchTags } from './service-image-queries';

const ASSETS_ROOT = path.join(__dirname, '..', 'assets', 'service-images');

const IMAGE_WIDTH = 800;
const IMAGE_HEIGHT = 600;
const DOWNLOAD_CONCURRENCY = 6;
const DOWNLOAD_MAX_ATTEMPTS = 3;
const USER_AGENT =
  'my-master-seed/1.0 (+https://localhost; service-image-assets)';

/** Bump when search strategy changes so stale random caches are not reused. */
const CACHE_VERSION = 'svc-query-v1';

export type ServiceImageAssetRequest = {
  category: string;
  serviceName: string;
  imageIndex: number;
};

export type ServiceImageAsset = {
  cacheKey: string;
  buffer: Buffer;
  mimeType: 'image/jpeg';
  fileSize: number;
  originalName: string;
  fileName: string;
};

const slugify = (value: string): string => {
  const translitMap: Record<string, string> = {
    а: 'a',
    б: 'b',
    в: 'v',
    г: 'g',
    д: 'd',
    е: 'e',
    ё: 'e',
    ж: 'zh',
    з: 'z',
    и: 'i',
    й: 'y',
    к: 'k',
    л: 'l',
    м: 'm',
    н: 'n',
    о: 'o',
    п: 'p',
    р: 'r',
    с: 's',
    т: 't',
    у: 'u',
    ф: 'f',
    х: 'h',
    ц: 'ts',
    ч: 'ch',
    ш: 'sh',
    щ: 'sch',
    ъ: '',
    ы: 'y',
    ь: '',
    э: 'e',
    ю: 'yu',
    я: 'ya',
    і: 'i',
    ї: 'yi',
    є: 'e',
    ґ: 'g',
  };

  const transliterated = value
    .split('')
    .map((char) => translitMap[char.toLowerCase()] ?? char)
    .join('');

  return (
    transliterated
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 80) || 'service'
  );
};

export const buildServiceImageCacheKey = (
  request: ServiceImageAssetRequest,
): string => {
  const searchTags = resolveFlickrSearchTags(
    request.serviceName,
    request.category,
  );
  return [
    CACHE_VERSION,
    request.category,
    slugify(request.serviceName),
    searchTags.replace(/,/g, '-'),
    String(request.imageIndex),
  ].join('_');
};

const cacheFilePath = (cacheKey: string): string => {
  const hash = createHash('sha1').update(cacheKey).digest('hex').slice(0, 16);
  return path.join(ASSETS_ROOT, `${hash}.jpg`);
};

const lockIdFromCacheKey = (cacheKey: string): number => {
  const digest = createHash('sha1').update(cacheKey).digest();
  return digest.readUInt32BE(0) % 1_000_000_000;
};

const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

const isJpegBuffer = (buffer: Buffer): boolean =>
  buffer.length > 3 &&
  buffer[0] === 0xff &&
  buffer[1] === 0xd8 &&
  buffer[2] === 0xff;

const fetchImageBuffer = async (url: string): Promise<Buffer> => {
  let response: Response;
  try {
    response = await fetch(url, {
      redirect: 'follow',
      headers: {
        Accept: 'image/jpeg,image/*;q=0.8,*/*;q=0.5',
        'User-Agent': USER_AGENT,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`network error for ${url}: ${message}`);
  }

  if (!response.ok) {
    throw new Error(`HTTP ${response.status} for ${url}`);
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  if (!isJpegBuffer(buffer)) {
    throw new Error(`non-JPEG payload for ${url} (${buffer.byteLength} bytes)`);
  }

  return buffer;
};

const buildLoremFlickrUrl = (
  searchTags: string,
  cacheKey: string,
): string => {
  const lock = lockIdFromCacheKey(cacheKey);
  // Without `/all` → match ANY tag (better recall for specific service queries).
  return `https://loremflickr.com/${IMAGE_WIDTH}/${IMAGE_HEIGHT}/${searchTags}?lock=${lock}`;
};

const buildPlaceholdUrl = (cacheKey: string, label: string): string => {
  const digest = createHash('sha1').update(cacheKey).digest('hex');
  const bg = digest.slice(0, 6);
  const fg = digest.slice(6, 12);
  const text = encodeURIComponent(label.slice(0, 40));
  return `https://placehold.co/${IMAGE_WIDTH}x${IMAGE_HEIGHT}/${bg}/${fg}/jpg?text=${text}`;
};

const downloadImage = async (
  request: ServiceImageAssetRequest,
  cacheKey: string,
): Promise<Buffer> => {
  const searchTags = resolveFlickrSearchTags(
    request.serviceName,
    request.category,
  );
  const primaryUrl = buildLoremFlickrUrl(searchTags, cacheKey);
  const fallbackUrl = buildPlaceholdUrl(cacheKey, request.serviceName);
  const urls = [primaryUrl, fallbackUrl];
  const errors: string[] = [];

  for (const url of urls) {
    for (let attempt = 1; attempt <= DOWNLOAD_MAX_ATTEMPTS; attempt += 1) {
      try {
        return await fetchImageBuffer(url);
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);
        errors.push(`attempt ${attempt} ${url}: ${message}`);
        if (attempt < DOWNLOAD_MAX_ATTEMPTS) {
          await sleep(250 * attempt);
        }
      }
    }
  }

  throw new Error(
    `service-image-assets: failed to download image for ${request.serviceName}. ` +
      `Ensure network access on first seed run, or prefill ${ASSETS_ROOT}. ` +
      `Details: ${errors.join(' | ')}`,
  );
};

const loadOrDownloadAsset = async (
  request: ServiceImageAssetRequest,
): Promise<ServiceImageAsset> => {
  const cacheKey = buildServiceImageCacheKey(request);
  const filePath = cacheFilePath(cacheKey);

  let buffer: Buffer;
  try {
    buffer = await readFile(filePath);
    if (!isJpegBuffer(buffer)) {
      throw new Error('cached file is not a JPEG');
    }
  } catch {
    buffer = await downloadImage(request, cacheKey);
    await mkdir(ASSETS_ROOT, { recursive: true });
    await writeFile(filePath, buffer);
  }

  return {
    cacheKey,
    buffer,
    mimeType: 'image/jpeg',
    fileSize: buffer.byteLength,
    originalName: `${slugify(request.serviceName)}-${request.imageIndex}.jpg`,
    fileName: slugify(`${request.serviceName}-${request.imageIndex}`),
  };
};

const mapWithConcurrency = async <T, R>(
  items: T[],
  concurrency: number,
  mapper: (item: T) => Promise<R>,
): Promise<R[]> => {
  const results = new Array<R>(items.length);
  let nextIndex = 0;

  const workers = Array.from(
    { length: Math.min(concurrency, items.length) },
    async () => {
      while (nextIndex < items.length) {
        const current = nextIndex;
        nextIndex += 1;
        results[current] = await mapper(items[current]);
      }
    },
  );

  await Promise.all(workers);
  return results;
};

export const resolveServiceImageAssets = async (
  requests: ServiceImageAssetRequest[],
): Promise<ServiceImageAsset[]> => {
  if (requests.length === 0) {
    return [];
  }

  const uniqueByCacheKey = new Map<string, ServiceImageAssetRequest>();
  for (const request of requests) {
    uniqueByCacheKey.set(buildServiceImageCacheKey(request), request);
  }

  return mapWithConcurrency(
    [...uniqueByCacheKey.values()],
    DOWNLOAD_CONCURRENCY,
    loadOrDownloadAsset,
  );
};

export { mapWithConcurrency };
