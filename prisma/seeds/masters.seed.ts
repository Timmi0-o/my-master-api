import type { PrismaClient } from '@prisma/client';
import type { SeedRunner } from './index';
import { MASTERS_CATALOG } from './masters-catalog';

const pickSeedUsers = async (prisma: PrismaClient) => {
  const users = await prisma.user.findMany({
    where: {
      deletedAt: null,
      status: 'ACTIVE',
      role: 'USER',
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

  let profileIndex = 0;

  for (const entry of MASTERS_CATALOG) {
    const user = users[profileIndex % users.length];
    profileIndex += 1;

    const deletedAt = entry.softDeleted ? new Date() : null;

    const existingProfile = await prisma.masterProfile.findFirst({
      where: {
        userId: user.id,
        displayName: entry.displayName,
      },
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
          deletedAt: serviceDeletedAt,
        },
      });
    }
  }

  const profileCount = await prisma.masterProfile.count();
  const serviceCount = await prisma.masterService.count();

  console.log(
    `masters seed: ${profileCount} profiles, ${serviceCount} services (${MASTERS_CATALOG.length} catalog entries)`,
  );
};
