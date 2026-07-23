import type { Language, PrismaClient, Status } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { SYSTEM_ROLE_IDS } from '../../src/modules/authorization/domain/entities/role/system-role-ids';
import { ERoleIdentifier } from '../../src/modules/authorization/domain/entities/role/role.enum';
import type { SeedRunner } from './index';

const USERS_COUNT = 180;
const SEED_PASSWORD = 'password';
const SEED_BCRYPT_ROUNDS = 10;

const buildRoleId = (index: number): string => {
  if (index === 1) return SYSTEM_ROLE_IDS[ERoleIdentifier.SUPER_ADMIN];
  if (index <= 3) return SYSTEM_ROLE_IDS[ERoleIdentifier.ADMIN];
  return SYSTEM_ROLE_IDS[ERoleIdentifier.USER];
};

const buildStatus = (index: number): Status => {
  if (index % 10 === 0) return 'BLOCKED';
  if (index % 7 === 0) return 'INACTIVE';
  return 'ACTIVE';
};

const buildUserData = (index: number, passwordHash: string) => {
  const padded = String(index).padStart(2, '0');

  return {
    email: `user${padded}@example.com`,
    phone: `+7999000${String(index).padStart(4, '0')}`,
    username: `user_${padded}`,
    roleId: buildRoleId(index),
    status: buildStatus(index),
    passwordHash,
    name: `Name${padded}`,
    surname: `Surname${padded}`,
    patronymic: index % 2 === 0 ? `Patronymic${padded}` : null,
    language: 'RU' as Language,
  };
};

export const usersSeed: SeedRunner = async (
  prisma: PrismaClient,
): Promise<void> => {
  const passwordHash = await bcrypt.hash(SEED_PASSWORD, SEED_BCRYPT_ROUNDS);

  for (let index = 1; index <= USERS_COUNT; index += 1) {
    const userData = buildUserData(index, passwordHash);

    await prisma.user.upsert({
      where: { email: userData.email },
      create: userData,
      update: {
        phone: userData.phone,
        username: userData.username,
        roleId: userData.roleId,
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
