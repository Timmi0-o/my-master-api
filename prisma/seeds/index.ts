import type { PrismaClient } from '@prisma/client';
import { appointmentsSeed } from './appointments.seed';
import { masterSchedulesSeed } from './master-schedules.seed';
import { masterServiceImagesSeed } from './master-service-images.seed';
import { masterServiceReviewsSeed } from './master-service-reviews.seed';
import { mastersSeed } from './masters.seed';
import { rbacSeed } from './rbac.seed';
import { userProfilesSeed } from './user-profiles.seed';
import { usersSeed } from './users.seed';

export type SeedRunner = (prisma: PrismaClient) => Promise<void>;

export const seeds: SeedRunner[] = [
  rbacSeed,
  usersSeed,
  userProfilesSeed,
  mastersSeed,
  masterServiceImagesSeed,
  masterSchedulesSeed,
  appointmentsSeed,
  masterServiceReviewsSeed,
];
