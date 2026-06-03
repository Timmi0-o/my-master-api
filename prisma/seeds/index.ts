import type { PrismaClient } from '@prisma/client';
import { mastersSeed } from './masters.seed';
import { userProfilesSeed } from './user-profiles.seed';
import { usersSeed } from './users.seed';

export type SeedRunner = (prisma: PrismaClient) => Promise<void>;

export const seeds: SeedRunner[] = [usersSeed, userProfilesSeed, mastersSeed];
