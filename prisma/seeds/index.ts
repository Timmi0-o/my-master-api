import type { PrismaClient } from '@prisma/client';
import { mastersSeed } from './masters.seed';
import { usersSeed } from './users.seed';

export type SeedRunner = (prisma: PrismaClient) => Promise<void>;

export const seeds: SeedRunner[] = [usersSeed, mastersSeed];
