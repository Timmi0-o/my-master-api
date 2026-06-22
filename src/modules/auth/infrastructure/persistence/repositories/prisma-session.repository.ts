import { Injectable } from '@nestjs/common';
import type { TransactionScope } from '@shared/domain/transactions';
import { unwrapPrismaTxFromScope } from '@shared/infrastructure/persistence/transactions';
import { PrismaService } from '@shared/infrastructure/persistence/prisma/prisma.service';
import type { ISessionRepository } from 'src/modules/auth/domain/repositories/i-session.repository';

@Injectable()
export class PrismaSessionRepository implements ISessionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    payload: {
      userId: string;
      ipAddress?: string | null;
      userAgent?: string | null;
    },
    scope: TransactionScope,
  ): Promise<void> {
    const tx = unwrapPrismaTxFromScope(scope);
    await tx.session.create({
      data: {
        userId: payload.userId,
        ipAddress: payload.ipAddress ?? null,
        userAgent: payload.userAgent ?? null,
      },
    });
  }
}
