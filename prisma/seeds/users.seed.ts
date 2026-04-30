import type { PrismaClient, Role, Status, Language } from '@prisma/client';
import type { SeedRunner } from './index';

const USERS_COUNT = 30;

const buildRole = (index: number): Role => {
  if (index === 1) return 'SUPER_ADMIN';
  if (index <= 3) return 'ADMIN';
  return 'USER';
};

const buildStatus = (index: number): Status => {
  if (index % 10 === 0) return 'BLOCKED';
  if (index % 7 === 0) return 'INACTIVE';
  return 'ACTIVE';
};

const buildUserData = (index: number) => {
  const padded = String(index).padStart(2, '0');

  return {
    email: `user${padded}@example.com`,
    phone: `+7999000${String(index).padStart(4, '0')}`,
    username: `user_${padded}`,
    role: buildRole(index),
    status: buildStatus(index),
    passwordHash: `seed_password_hash_${padded}`,
    name: `Name${padded}`,
    surname: `Surname${padded}`,
    patronymic: index % 2 === 0 ? `Patronymic${padded}` : null,
    language: 'RU' as Language,
  };
};

export const usersSeed: SeedRunner = async (
  prisma: PrismaClient,
): Promise<void> => {
  for (let index = 1; index <= USERS_COUNT; index += 1) {
    const userData = buildUserData(index);

    await prisma.user.upsert({
      where: { email: userData.email },
      create: userData,
      update: {
        phone: userData.phone,
        username: userData.username,
        role: userData.role,
        status: userData.status,
        passwordHash: userData.passwordHash,
        name: userData.name,
        surname: userData.surname,
        patronymic: userData.patronymic,
        language: userData.language,
        deletedAt: null,
      },
    });
  }
};
