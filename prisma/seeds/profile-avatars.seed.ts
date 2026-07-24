import { randomUUID } from 'crypto';
import type { PrismaClient } from '@prisma/client';
import {
  IMAGE_ENTITY_CONFIG,
  ImageEntityType,
} from '../../src/modules/masters/domain/entities/image';
import type { SeedRunner } from './index';
import { createSeedS3Client, type SeedS3Client } from './utils/seed-s3-client';
import {
  buildProfileAvatarCacheKey,
  resolveProfileAvatarAssets,
  type ProfileAvatarAssetRequest,
  type ProfileAvatarKind,
} from './utils/profile-avatar-assets';
import { mapWithConcurrency } from './utils/service-image-assets';

const UPLOAD_CONCURRENCY = 8;
const DELETE_CONCURRENCY = 12;
const AVATARS_PER_PROFILE = 1;

const S3_FILE_URL_PATTERN = /^s3:\/\/([^/]+)\/(.+)$/;

type ProfileTarget = {
  kind: ProfileAvatarKind;
  entityType:
    | typeof ImageEntityType.MASTER_PROFILE_AVATAR
    | typeof ImageEntityType.CLIENT_PROFILE_AVATAR;
  profileId: string;
  userId: string;
  displayName: string;
  objectKeyPrefix: string;
};

const isForceProfileAvatars = (): boolean => {
  const raw = process.env.SEED_FORCE_PROFILE_AVATARS?.trim().toLowerCase();
  return raw === '1' || raw === 'true' || raw === 'yes';
};

const objectKeyFromFileUrl = (fileUrl: string): string | null => {
  const match = fileUrl.match(S3_FILE_URL_PATTERN);
  return match?.[2] ?? null;
};

const clearExistingAvatars = async (
  prisma: PrismaClient,
  s3: SeedS3Client,
  targets: ProfileTarget[],
): Promise<number> => {
  if (targets.length === 0) {
    return 0;
  }

  const byEntityType = new Map<ImageEntityType, string[]>();
  for (const target of targets) {
    const ids = byEntityType.get(target.entityType) ?? [];
    ids.push(target.profileId);
    byEntityType.set(target.entityType, ids);
  }

  const existingImages = await prisma.image.findMany({
    where: {
      OR: [...byEntityType.entries()].map(([entityType, entityIds]) => ({
        entityType,
        entityId: { in: entityIds },
      })),
    },
    select: {
      id: true,
      fileId: true,
      file: {
        select: {
          id: true,
          fileUrl: true,
        },
      },
    },
  });

  if (existingImages.length === 0) {
    return 0;
  }

  await mapWithConcurrency(existingImages, DELETE_CONCURRENCY, async (image) => {
    const objectKey = objectKeyFromFileUrl(image.file.fileUrl);
    if (objectKey) {
      try {
        await s3.deleteObject(objectKey);
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);
        console.warn(
          `profile-avatars seed: failed to delete S3 object ${objectKey}: ${message}`,
        );
      }
    }
  });

  const fileIds = existingImages.map((image) => image.fileId);

  await prisma.image.deleteMany({
    where: { id: { in: existingImages.map((image) => image.id) } },
  });

  await prisma.file.deleteMany({
    where: { id: { in: fileIds } },
  });

  return existingImages.length;
};

const loadTargets = async (prisma: PrismaClient): Promise<ProfileTarget[]> => {
  const [masterProfiles, userProfiles] = await Promise.all([
    prisma.masterProfile.findMany({
      select: {
        id: true,
        userId: true,
        displayName: true,
      },
      orderBy: { displayName: 'asc' },
    }),
    prisma.userProfile.findMany({
      select: {
        id: true,
        userId: true,
        displayName: true,
      },
      orderBy: { displayName: 'asc' },
    }),
  ]);

  return [
    ...masterProfiles.map(
      (profile): ProfileTarget => ({
        kind: 'master',
        entityType: ImageEntityType.MASTER_PROFILE_AVATAR,
        profileId: profile.id,
        userId: profile.userId,
        displayName: profile.displayName,
        objectKeyPrefix: 'master-profile',
      }),
    ),
    ...userProfiles.map(
      (profile): ProfileTarget => ({
        kind: 'client',
        entityType: ImageEntityType.CLIENT_PROFILE_AVATAR,
        profileId: profile.id,
        userId: profile.userId,
        displayName: profile.displayName,
        objectKeyPrefix: 'user-profile',
      }),
    ),
  ];
};

export const profileAvatarsSeed: SeedRunner = async (
  prisma: PrismaClient,
): Promise<void> => {
  const force = isForceProfileAvatars();
  const targets = await loadTargets(prisma);

  if (targets.length === 0) {
    console.warn(
      'profile-avatars seed: no profiles found. Run user-profiles and masters seeds first.',
    );
    return;
  }

  const imageCounts = await prisma.image.groupBy({
    by: ['entityType', 'entityId'],
    where: {
      OR: [
        {
          entityType: ImageEntityType.MASTER_PROFILE_AVATAR,
          entityId: {
            in: targets
              .filter((t) => t.entityType === ImageEntityType.MASTER_PROFILE_AVATAR)
              .map((t) => t.profileId),
          },
        },
        {
          entityType: ImageEntityType.CLIENT_PROFILE_AVATAR,
          entityId: {
            in: targets
              .filter((t) => t.entityType === ImageEntityType.CLIENT_PROFILE_AVATAR)
              .map((t) => t.profileId),
          },
        },
      ],
    },
    _count: { _all: true },
  });

  const countKey = (entityType: ImageEntityType, entityId: string): string =>
    `${entityType}:${entityId}`;

  const countByTarget = new Map(
    imageCounts.map((row) => [
      countKey(row.entityType as ImageEntityType, row.entityId),
      row._count._all,
    ]),
  );

  const s3 = createSeedS3Client();
  await s3.ensureBucket();

  let removedImages = 0;
  if (force) {
    removedImages = await clearExistingAvatars(prisma, s3, targets);
    console.log(
      `profile-avatars seed: SEED_FORCE_PROFILE_AVATARS enabled, removed ${removedImages} existing avatars`,
    );
  }

  let skippedProfiles = 0;

  const profilesNeedingAvatars = targets.filter((target) => {
    const existingCount = force
      ? 0
      : (countByTarget.get(countKey(target.entityType, target.profileId)) ?? 0);
    if (existingCount >= AVATARS_PER_PROFILE) {
      skippedProfiles += 1;
      return false;
    }
    return true;
  });

  type UploadJob = {
    target: ProfileTarget;
    request: ProfileAvatarAssetRequest;
    cacheKey: string;
  };

  const jobs: UploadJob[] = profilesNeedingAvatars.map((target) => {
    const request: ProfileAvatarAssetRequest = {
      kind: target.kind,
      profileId: target.profileId,
      displayName: target.displayName,
    };
    return {
      target,
      request,
      cacheKey: buildProfileAvatarCacheKey(request),
    };
  });

  const assets = await resolveProfileAvatarAssets(jobs.map((job) => job.request));
  const assetsByKey = new Map(assets.map((asset) => [asset.cacheKey, asset]));

  let uploadedFiles = 0;

  await mapWithConcurrency(jobs, UPLOAD_CONCURRENCY, async (job) => {
    const asset = assetsByKey.get(job.cacheKey);
    if (!asset) {
      throw new Error(
        `profile-avatars seed: missing asset for cacheKey ${job.cacheKey}`,
      );
    }

    const fileDefaults = IMAGE_ENTITY_CONFIG[job.target.entityType];
    const fileId = randomUUID();
    const objectKey = `${job.target.objectKeyPrefix}/${job.target.profileId}/${Date.now()}-${fileId}.jpg`;
    const fileUrl = `s3://${s3.bucket}/${objectKey}`;

    await s3.putObject(objectKey, asset.buffer, asset.mimeType);

    await prisma.file.create({
      data: {
        id: fileId,
        uploadedBy: job.target.userId,
        fileName: asset.fileName,
        originalName: asset.originalName,
        mimeType: asset.mimeType,
        fileSize: BigInt(asset.fileSize),
        fileUrl,
        status: 'UPLOADED',
        fileType: fileDefaults.fileType,
        ownerType: fileDefaults.ownerType,
        ownerKind: fileDefaults.ownerKind,
        ownerId: job.target.profileId,
        accessLevel: fileDefaults.accessLevel,
        purpose: fileDefaults.purpose,
      },
    });

    await prisma.image.create({
      data: {
        entityType: job.target.entityType,
        entityId: job.target.profileId,
        fileId,
      },
    });

    uploadedFiles += 1;
  });

  const masterCount = targets.filter(
    (t) => t.entityType === ImageEntityType.MASTER_PROFILE_AVATAR,
  ).length;
  const clientCount = targets.filter(
    (t) => t.entityType === ImageEntityType.CLIENT_PROFILE_AVATAR,
  ).length;

  console.log(
    `profile-avatars seed: ${profilesNeedingAvatars.length} profiles updated, ` +
      `${uploadedFiles} files uploaded, ${skippedProfiles} profiles skipped` +
      (force ? `, force-replaced ${removedImages}` : '') +
      ` (target ${AVATARS_PER_PROFILE}/profile; masters: ${masterCount}, clients: ${clientCount})`,
  );
};
