import { randomUUID } from 'crypto';
import type { PrismaClient } from '@prisma/client';
import { MASTER_SERVICE_IMAGE_FILE_DEFAULTS } from '../../src/modules/masters/domain/entities/master-service-image/master-service-image-upload.constants';
import type { SeedRunner } from './index';
import { createSeedS3Client, type SeedS3Client } from './utils/seed-s3-client';
import {
  buildServiceImageCacheKey,
  mapWithConcurrency,
  resolveServiceImageAssets,
  type ServiceImageAssetRequest,
} from './utils/service-image-assets';

const IMAGES_PER_SERVICE = 5;
const UPLOAD_CONCURRENCY = 8;
const DELETE_CONCURRENCY = 12;

const S3_FILE_URL_PATTERN = /^s3:\/\/([^/]+)\/(.+)$/;

const isForceServiceImages = (): boolean => {
  const raw = process.env.SEED_FORCE_SERVICE_IMAGES?.trim().toLowerCase();
  return raw === '1' || raw === 'true' || raw === 'yes';
};

const objectKeyFromFileUrl = (fileUrl: string): string | null => {
  const match = fileUrl.match(S3_FILE_URL_PATTERN);
  return match?.[2] ?? null;
};

const clearExistingServiceImages = async (
  prisma: PrismaClient,
  s3: SeedS3Client,
  serviceIds: string[],
): Promise<number> => {
  if (serviceIds.length === 0) {
    return 0;
  }

  const existingImages = await prisma.masterServiceImage.findMany({
    where: { masterServiceId: { in: serviceIds } },
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
          `master-service-images seed: failed to delete S3 object ${objectKey}: ${message}`,
        );
      }
    }
  });

  const fileIds = existingImages.map((image) => image.fileId);

  await prisma.masterServiceImage.deleteMany({
    where: { id: { in: existingImages.map((image) => image.id) } },
  });

  await prisma.file.deleteMany({
    where: { id: { in: fileIds } },
  });

  return existingImages.length;
};

export const masterServiceImagesSeed: SeedRunner = async (
  prisma: PrismaClient,
): Promise<void> => {
  const force = isForceServiceImages();

  const services = await prisma.masterService.findMany({
    select: {
      id: true,
      name: true,
      category: true,
      masterProfile: {
        select: { userId: true },
      },
      images: {
        select: { id: true },
      },
    },
    orderBy: [{ category: 'asc' }, { name: 'asc' }],
  });

  if (services.length === 0) {
    console.warn(
      'master-service-images seed: no services found. Run masters seed first.',
    );
    return;
  }

  const s3 = createSeedS3Client();
  await s3.ensureBucket();

  let removedImages = 0;
  if (force) {
    removedImages = await clearExistingServiceImages(
      prisma,
      s3,
      services.map((service) => service.id),
    );
    console.log(
      `master-service-images seed: SEED_FORCE_SERVICE_IMAGES enabled, removed ${removedImages} existing images`,
    );
  }

  let skippedServices = 0;
  let uploadedFiles = 0;

  const servicesNeedingImages = services.filter((service) => {
    const existingCount = force ? 0 : service.images.length;
    if (existingCount >= IMAGES_PER_SERVICE) {
      skippedServices += 1;
      return false;
    }
    return true;
  });

  type UploadJob = {
    serviceId: string;
    uploadedBy: string;
    request: ServiceImageAssetRequest;
    cacheKey: string;
  };

  const jobs: UploadJob[] = [];

  for (const service of servicesNeedingImages) {
    const existingCount = force ? 0 : service.images.length;
    for (
      let imageIndex = existingCount;
      imageIndex < IMAGES_PER_SERVICE;
      imageIndex += 1
    ) {
      const request: ServiceImageAssetRequest = {
        category: service.category,
        serviceName: service.name,
        imageIndex,
      };
      jobs.push({
        serviceId: service.id,
        uploadedBy: service.masterProfile.userId,
        request,
        cacheKey: buildServiceImageCacheKey(request),
      });
    }
  }

  const assets = await resolveServiceImageAssets(jobs.map((job) => job.request));
  const assetsByKey = new Map(assets.map((asset) => [asset.cacheKey, asset]));

  await mapWithConcurrency(jobs, UPLOAD_CONCURRENCY, async (job) => {
    const asset = assetsByKey.get(job.cacheKey);
    if (!asset) {
      throw new Error(
        `master-service-images seed: missing asset for cacheKey ${job.cacheKey}`,
      );
    }

    const fileId = randomUUID();
    const objectKey = `master-service/${job.serviceId}/${Date.now()}-${fileId}.jpg`;
    const fileUrl = `s3://${s3.bucket}/${objectKey}`;

    await s3.putObject(objectKey, asset.buffer, asset.mimeType);

    await prisma.file.create({
      data: {
        id: fileId,
        uploadedBy: job.uploadedBy,
        fileName: asset.fileName,
        originalName: asset.originalName,
        mimeType: asset.mimeType,
        fileSize: BigInt(asset.fileSize),
        fileUrl,
        status: 'UPLOADED',
        fileType: MASTER_SERVICE_IMAGE_FILE_DEFAULTS.fileType,
        ownerType: MASTER_SERVICE_IMAGE_FILE_DEFAULTS.ownerType,
        ownerKind: MASTER_SERVICE_IMAGE_FILE_DEFAULTS.ownerKind,
        ownerId: job.serviceId,
        accessLevel: MASTER_SERVICE_IMAGE_FILE_DEFAULTS.accessLevel,
        purpose: MASTER_SERVICE_IMAGE_FILE_DEFAULTS.purpose,
      },
    });

    await prisma.masterServiceImage.create({
      data: {
        masterServiceId: job.serviceId,
        fileId,
      },
    });

    uploadedFiles += 1;
  });

  console.log(
    `master-service-images seed: ${servicesNeedingImages.length} services updated, ` +
      `${uploadedFiles} files uploaded, ${skippedServices} services skipped` +
      (force ? `, force-replaced ${removedImages}` : '') +
      ` (target ${IMAGES_PER_SERVICE}/service; total services: ${services.length})`,
  );
};
