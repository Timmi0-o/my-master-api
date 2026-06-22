import type { PrismaClient } from '@prisma/client';

/**
 * Тип transactional Prisma-клиента — первый аргумент callback'а
 * `prisma.$transaction(async (tx) => ...)`.
 */
export type PrismaTxClient = Parameters<
  Parameters<PrismaClient['$transaction']>[0]
>[0];
