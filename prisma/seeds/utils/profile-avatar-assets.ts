import { createHash } from 'crypto';
import { mkdir, readFile, writeFile } from 'fs/promises';
import path from 'path';
import { mapWithConcurrency } from './service-image-assets';

const ASSETS_ROOT = path.join(__dirname, '..', 'assets', 'profile-avatars');

const IMAGE_WIDTH = 512;
const IMAGE_HEIGHT = 512;
const DOWNLOAD_CONCURRENCY = 6;
const DOWNLOAD_MAX_ATTEMPTS = 3;
const PORTRAIT_INDEX_MAX = 99;
const USER_AGENT =
  'my-master-seed/1.0 (+https://localhost; profile-avatar-assets)';

/**
 * Bump when source/strategy changes so costume LoremFlickr caches are not reused.
 * v2: randomuser.me headshots + gender from display name.
 */
const CACHE_VERSION = 'avatar-headshot-v2';

export type ProfileAvatarKind = 'master' | 'client';
export type ProfileAvatarGender = 'male' | 'female';

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

const FEMALE_FIRST_NAMES = new Set([
  'анна',
  'мария',
  'ольга',
  'елена',
  'наталья',
  'ксения',
  'виктория',
  'дарья',
  'алина',
  'ирина',
  'татьяна',
  'юлия',
  'екатерина',
  'софия',
  'полина',
]);

const MALE_FIRST_NAMES = new Set([
  'иван',
  'сергей',
  'дмитрий',
  'алексей',
  'павел',
  'артём',
  'артем',
  'никита',
  'максим',
  'андрей',
  'михаил',
  'кирилл',
  'роман',
  'евгений',
  'владимир',
]);

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

const normalizeNameToken = (value: string): string =>
  value.trim().toLowerCase().replace(/ё/g, 'е');

export const inferProfileAvatarGender = (
  displayName: string,
  profileId: string,
): ProfileAvatarGender => {
  const tokens = displayName
    .split(/[\s/_.,\-]+/)
    .map(normalizeNameToken)
    .filter(Boolean);

  for (const token of tokens) {
    if (FEMALE_FIRST_NAMES.has(token)) {
      return 'female';
    }
    if (MALE_FIRST_NAMES.has(token)) {
      return 'male';
    }
  }

  // Stable fallback when name is synthetic (e.g. Name01).
  const digest = createHash('sha1').update(profileId).digest();
  return digest[0] % 2 === 0 ? 'female' : 'male';
};

const portraitFolder = (gender: ProfileAvatarGender): 'women' | 'men' =>
  gender === 'female' ? 'women' : 'men';

const portraitIndexFromCacheKey = (cacheKey: string): number => {
  const digest = createHash('sha1').update(cacheKey).digest();
  return digest.readUInt32BE(0) % (PORTRAIT_INDEX_MAX + 1);
};

export const buildProfileAvatarCacheKey = (
  request: ProfileAvatarAssetRequest,
): string => {
  const gender = inferProfileAvatarGender(
    request.displayName,
    request.profileId,
  );
  return [
    CACHE_VERSION,
    request.kind,
    gender,
    request.profileId,
    slugify(request.displayName),
  ].join('_');
};

const cacheFilePath = (cacheKey: string): string => {
  const hash = createHash('sha1').update(cacheKey).digest('hex').slice(0, 16);
  return path.join(ASSETS_ROOT, `${hash}.jpg`);
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

const buildRandomUserPortraitUrl = (
  gender: ProfileAvatarGender,
  cacheKey: string,
): string => {
  const index = portraitIndexFromCacheKey(cacheKey);
  return `https://randomuser.me/api/portraits/${portraitFolder(gender)}/${index}.jpg`;
};

/** Secondary source: deterministic professional-looking stub if randomuser is down. */
const buildPlaceholdUrl = (cacheKey: string, label: string): string => {
  const digest = createHash('sha1').update(cacheKey).digest('hex');
  const bg = digest.slice(0, 6);
  const fg = digest.slice(6, 12);
  const text = encodeURIComponent(label.slice(0, 24));
  return `https://placehold.co/${IMAGE_WIDTH}x${IMAGE_HEIGHT}/${bg}/${fg}/jpg?text=${text}`;
};

const downloadImage = async (
  request: ProfileAvatarAssetRequest,
  cacheKey: string,
): Promise<Buffer> => {
  const gender = inferProfileAvatarGender(
    request.displayName,
    request.profileId,
  );
  const primaryUrl = buildRandomUserPortraitUrl(gender, cacheKey);
  // Try a nearby portrait index if the first one fails.
  const altIndex = (portraitIndexFromCacheKey(cacheKey) + 17) % (PORTRAIT_INDEX_MAX + 1);
  const secondaryUrl = `https://randomuser.me/api/portraits/${portraitFolder(gender)}/${altIndex}.jpg`;
  const fallbackUrl = buildPlaceholdUrl(cacheKey, request.displayName);
  const urls = [primaryUrl, secondaryUrl, fallbackUrl];
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
