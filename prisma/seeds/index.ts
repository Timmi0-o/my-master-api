import type { PrismaClient } from '@prisma/client';
import { appointmentsSeed } from './appointments.seed';
import { masterSchedulesSeed } from './master-schedules.seed';
import { mastersSeed } from './masters.seed';
import { userProfilesSeed } from './user-profiles.seed';
import { usersSeed } from './users.seed';

export type SeedRunner = (prisma: PrismaClient) => Promise<void>;

export const seeds: SeedRunner[] = [
  usersSeed,
  userProfilesSeed,
  mastersSeed,
  masterSchedulesSeed,
  appointmentsSeed,
];
