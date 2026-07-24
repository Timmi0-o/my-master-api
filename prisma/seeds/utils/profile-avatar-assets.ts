import { createHash } from 'crypto';
import { mkdir, readFile, writeFile } from 'fs/promises';
import path from 'path';
import { mapWithConcurrency } from './service-image-assets';

const ASSETS_ROOT = path.join(__dirname, '..', 'assets', 'profile-avatars');

const IMAGE_WIDTH = 512;
const IMAGE_HEIGHT = 512;
const DOWNLOAD_CONCURRENCY = 6;
const DOWNLOAD_MAX_ATTEMPTS = 3;
const USER_AGENT =
  'my-master-seed/1.0 (+https://localhost; profile-avatar-assets)';

/** Bump when search strategy changes so stale random caches are not reused. */
const CACHE_VERSION = 'avatar-portrait-v1';
const FLICKR_TAGS = 'portrait,face,person';

export type ProfileAvatarKind = 'master' | 'client';

export type ProfileAvatarAssetRequest = {
  kind: ProfileAvatarKind;
  profileId: string;
  displayName: string;
};

export type ProfileAvatarAsset = {
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
      .slice(0, 80) || 'avatar'
  );
};

export const buildProfileAvatarCacheKey = (
  request: ProfileAvatarAssetRequest,
): string =>
  [CACHE_VERSION, request.kind, request.profileId, FLICKR_TAGS.replace(/,/g, '-')].join(
    '_',
  );

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

const buildLoremFlickrUrl = (cacheKey: string): string => {
  const lock = lockIdFromCacheKey(cacheKey);
  return `https://loremflickr.com/${IMAGE_WIDTH}/${IMAGE_HEIGHT}/${FLICKR_TAGS}?lock=${lock}`;
};

const buildPlaceholdUrl = (cacheKey: string, label: string): string => {
  const digest = createHash('sha1').update(cacheKey).digest('hex');
  const bg = digest.slice(0, 6);
  const fg = digest.slice(6, 12);
  const text = encodeURIComponent(label.slice(0, 40));
  return `https://placehold.co/${IMAGE_WIDTH}x${IMAGE_HEIGHT}/${bg}/${fg}/jpg?text=${text}`;
};

const downloadImage = async (
  request: ProfileAvatarAssetRequest,
  cacheKey: string,
): Promise<Buffer> => {
  const primaryUrl = buildLoremFlickrUrl(cacheKey);
  const fallbackUrl = buildPlaceholdUrl(cacheKey, request.displayName);
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
    `profile-avatar-assets: failed to download avatar for ${request.displayName}. ` +
      `Ensure network access on first seed run, or prefill ${ASSETS_ROOT}. ` +
      `Details: ${errors.join(' | ')}`,
  );
};

const loadOrDownloadAsset = async (
  request: ProfileAvatarAssetRequest,
): Promise<ProfileAvatarAsset> => {
  const cacheKey = buildProfileAvatarCacheKey(request);
  const filePath = cacheFilePath(cacheKey);
  const slug = slugify(request.displayName);

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
    originalName: `${slug}-avatar.jpg`,
    fileName: slugify(`${slug}-avatar`),
  };
};

export const resolveProfileAvatarAssets = async (
  requests: ProfileAvatarAssetRequest[],
): Promise<ProfileAvatarAsset[]> => {
  if (requests.length === 0) {
    return [];
  }

  const uniqueByCacheKey = new Map<string, ProfileAvatarAssetRequest>();
  for (const request of requests) {
    uniqueByCacheKey.set(buildProfileAvatarCacheKey(request), request);
  }

  return mapWithConcurrency(
    [...uniqueByCacheKey.values()],
    DOWNLOAD_CONCURRENCY,
    loadOrDownloadAsset,
  );
};
