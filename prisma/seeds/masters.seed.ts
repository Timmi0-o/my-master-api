import type { PrismaClient } from '@prisma/client';
import type { SeedRunner } from './index';
import { MASTERS_CATALOG } from './masters-catalog';

const inferDurationMinutes = (serviceName: string): number => {
  const match = serviceName.match(/(\d+)\s*мин/i);
  if (match) {
    return Number.parseInt(match[1], 10);
  }
  if (/мойка|прокол|розетк|засор/i.test(serviceName)) {
    return 45;
  }
  if (/стрижк|маникюр|бород/i.test(serviceName)) {
    return 60;
  }
  if (/окраш|щит|керамик|химчист/i.test(serviceName)) {
    return 90;
  }
  return 60;
};

const pickSeedUsers = async (prisma: PrismaClient) => {
  const users = await prisma.user.findMany({
    where: {
      deletedAt: null,
      status: 'ACTIVE',
      role: { roleIdentifier: 'USER' },
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
            durationMinutes: inferDurationMinutes(service.name),
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
          durationMinutes: inferDurationMinutes(service.name),
          deletedAt: serviceDeletedAt,
        },
      });
    }
  }

  const profileCount = await prisma.masterProfile.count();
  const serviceCount = await prisma.masterService.count();

  console.log(
    `masters seed: ${profileCount} profiles, ${serviceCount} services (${entriesToSeed.length} catalog entries)`,
  );
};
