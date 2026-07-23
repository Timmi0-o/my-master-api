import type { PrismaClient } from '@prisma/client';
import { SYSTEM_ROLE_IDS } from '../../src/modules/authorization/domain/entities/role/system-role-ids';
import { ERoleIdentifier } from '../../src/modules/authorization/domain/entities/role/role.enum';
import type { SeedRunner } from './index';
import { MASTERS_CATALOG, MASTERS_CATALOG_STATS } from './masters-catalog';

const pickSeedUsers = async (prisma: PrismaClient) => {
  const users = await prisma.user.findMany({
    where: {
      deletedAt: null,
      status: 'ACTIVE',
      roleId: SYSTEM_ROLE_IDS[ERoleIdentifier.USER],
    },
    orderBy: { email: 'asc' },
    select: { id: true, email: true },
  });

  if (users.length === 0) {
    throw new Error(
      'masters seed: no active USER accounts. Run users seed first.',
    );
  }

  return users;
};

export const mastersSeed: SeedRunner = async (
  prisma: PrismaClient,
): Promise<void> => {
  const users = await pickSeedUsers(prisma);
  const entriesToSeed = MASTERS_CATALOG.slice(0, users.length);

  if (entriesToSeed.length < MASTERS_CATALOG.length) {
    console.warn(
      `masters seed: catalog has ${MASTERS_CATALOG.length} entries, but only ${users.length} users — seeding ${entriesToSeed.length} profiles (1 profile per user)`,
    );
  }

  for (const [index, entry] of entriesToSeed.entries()) {
    const user = users[index];
    const deletedAt = entry.softDeleted ? new Date() : null;

    const existingProfile = await prisma.masterProfile.findUnique({
      where: { userId: user.id },
    });

    const profile =
      existingProfile ??
      (await prisma.masterProfile.create({
        data: {
          userId: user.id,
          displayName: entry.displayName,
          description: entry.description,
          rating: entry.rating,
          deletedAt,
        },
      }));

    if (existingProfile) {
      await prisma.masterProfile.update({
        where: { id: existingProfile.id },
        data: {
          displayName: entry.displayName,
          description: entry.description,
          rating: entry.rating,
          deletedAt,
        },
      });
    }

    const profileId = existingProfile?.id ?? profile.id;

    for (const service of entry.services) {
      const serviceDeletedAt = service.softDeleted ? new Date() : null;

      const existingService = await prisma.masterService.findFirst({
        where: {
          masterProfileId: profileId,
          name: service.name,
        },
      });

      if (existingService) {
        await prisma.masterService.update({
          where: { id: existingService.id },
          data: {
            description: service.description,
            price: service.price,
            durationMinutes: service.durationMinutes,
            category: service.category,
            tags: service.tags,
            deletedAt: serviceDeletedAt,
          },
        });
        continue;
      }

      await prisma.masterService.create({
        data: {
          masterProfileId: profileId,
          name: service.name,
          description: service.description,
          price: service.price,
          durationMinutes: service.durationMinutes,
          category: service.category,
          tags: service.tags,
          deletedAt: serviceDeletedAt,
        },
      });
    }
  }

  const profileCount = await prisma.masterProfile.count();
  const serviceCount = await prisma.masterService.count();

  console.log(
    `masters seed: ${profileCount} profiles, ${serviceCount} services (catalog: ${MASTERS_CATALOG_STATS.masters} masters / ${MASTERS_CATALOG_STATS.services} services / ${MASTERS_CATALOG_STATS.categories} categories, seeded ${entriesToSeed.length})`,
  );
};
