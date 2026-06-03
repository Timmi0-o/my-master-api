import type { PrismaClient } from '@prisma/client';
import type { SeedRunner } from './index';

const buildRating = (index: number): number =>
  Math.round((3.5 + (index % 16) * 0.1) * 10) / 10;

const buildSoftDeleted = (index: number): Date | null =>
  index % 25 === 0 ? new Date() : null;

export const userProfilesSeed: SeedRunner = async (
  prisma: PrismaClient,
): Promise<void> => {
  const users = await prisma.user.findMany({
    where: { deletedAt: null },
    orderBy: { email: 'asc' },
    select: {
      id: true,
      name: true,
      surname: true,
      username: true,
    },
  });

  if (users.length === 0) {
    throw new Error(
      'user-profiles seed: no users found. Run users seed first.',
    );
  }

  for (const [index, user] of users.entries()) {
    const seedIndex = index + 1;
    const displayName =
      `${user.name} ${user.surname}`.trim() || user.username;
    const rating = buildRating(seedIndex);
    const deletedAt = buildSoftDeleted(seedIndex);

    const existingProfile = await prisma.userProfile.findUnique({
      where: { userId: user.id },
    });

    if (existingProfile) {
      await prisma.userProfile.update({
        where: { id: existingProfile.id },
        data: {
          displayName,
          rating,
          deletedAt,
        },
      });
      continue;
    }

    await prisma.userProfile.create({
      data: {
        userId: user.id,
        displayName,
        rating,
        deletedAt,
      },
    });
  }

  const profileCount = await prisma.userProfile.count();

  console.log(
    `user-profiles seed: ${profileCount} profiles (${users.length} users)`,
  );
};
