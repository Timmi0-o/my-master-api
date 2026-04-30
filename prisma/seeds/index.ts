import type { PrismaClient } from '@prisma/client';
import { usersSeed } from './users.seed';

export type SeedRunner = (prisma: PrismaClient) => Promise<void>;

export const seeds: SeedRunner[] = [usersSeed];
