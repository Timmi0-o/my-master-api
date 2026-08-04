import { Injectable } from '@nestjs/common';
import { PrismaService } from '@shared/infrastructure/persistence/prisma/prisma.service';
import { EUserServiceInteractionType } from 'src/modules/feed/domain/entities/user-service-interaction';
import type { FeedInterestSignal } from 'src/modules/feed/domain/entities/feed-ranking';
import {
  FEED_MS_PER_DAY,
  FEED_SIGNAL_LOOKBACK_DAYS,
} from 'src/modules/feed/domain/entities/feed-ranking';
import type { IFeedInterestSignalsReader } from 'src/modules/feed/domain/repositories/feed-interest-signals/i-feed-interest-signals.reader';
import type { EMasterServiceCategory } from 'src/modules/masters/domain/entities/master-service';

@Injectable()
export class PrismaFeedInterestSignalsReader implements IFeedInterestSignalsReader {
  constructor(private readonly prisma: PrismaService) {}

  async loadSignals(userId: string): Promise<FeedInterestSignal[]> {
    const since = new Date(
      Date.now() - FEED_SIGNAL_LOOKBACK_DAYS * FEED_MS_PER_DAY,
    );

    const [appointments, favorites, subscriptions, interactions] =
      await Promise.all([
        this.prisma.appointment.findMany({
          where: {
            clientUserId: userId,
            deletedAt: null,
            status: { in: ['CONFIRMED', 'COMPLETED'] },
            createdAt: { gte: since },
          },
          select: {
            masterServiceId: true,
            masterProfileId: true,
            createdAt: true,
            masterService: {
              select: { category: true, tags: true, deletedAt: true },
            },
          },
          take: 100,
          orderBy: { createdAt: 'desc' },
        }),
        this.prisma.favoriteMasterService.findMany({
          where: {
            userId,
            deletedAt: null,
            createdAt: { gte: since },
          },
          select: {
            masterServiceId: true,
            createdAt: true,
            masterService: {
              select: {
                category: true,
                tags: true,
                masterProfileId: true,
                deletedAt: true,
              },
            },
          },
          take: 100,
          orderBy: { createdAt: 'desc' },
        }),
        this.prisma.masterSubscription.findMany({
          where: {
            userId,
            deletedAt: null,
          },
          select: {
            masterProfileId: true,
            createdAt: true,
          },
          take: 100,
          orderBy: { createdAt: 'desc' },
        }),
        this.prisma.userServiceInteraction.findMany({
          where: {
            userId,
            createdAt: { gte: since },
          },
          select: {
            masterServiceId: true,
            type: true,
            createdAt: true,
            masterService: {
              select: {
                category: true,
                tags: true,
                masterProfileId: true,
                deletedAt: true,
              },
            },
          },
          take: 200,
          orderBy: { createdAt: 'desc' },
        }),
      ]);

    const signals: FeedInterestSignal[] = [];

    for (const row of appointments) {
      if (!row.masterService || row.masterService.deletedAt != null) continue;
      signals.push({
        kind: 'appointment',
        category: row.masterService.category as EMasterServiceCategory,
        tags: row.masterService.tags,
        masterProfileId: row.masterProfileId,
        masterServiceId: row.masterServiceId,
        at: row.createdAt,
      });
    }

    for (const row of favorites) {
      if (!row.masterService || row.masterService.deletedAt != null) continue;
      signals.push({
        kind: 'favorite',
        category: row.masterService.category as EMasterServiceCategory,
        tags: row.masterService.tags,
        masterProfileId: row.masterService.masterProfileId,
        masterServiceId: row.masterServiceId,
        at: row.createdAt,
      });
    }

    for (const row of subscriptions) {
      signals.push({
        kind: 'subscription',
        category: 'SERVICES' as EMasterServiceCategory,
        tags: [],
        masterProfileId: row.masterProfileId,
        at: row.createdAt,
      });
    }

    for (const row of interactions) {
      if (!row.masterService || row.masterService.deletedAt != null) continue;
      signals.push({
        kind: row.type === EUserServiceInteractionType.CLICK ? 'click' : 'view',
        category: row.masterService.category as EMasterServiceCategory,
        tags: row.masterService.tags,
        masterProfileId: row.masterService.masterProfileId,
        masterServiceId: row.masterServiceId,
        at: row.createdAt,
      });
    }

    return signals;
  }
}
