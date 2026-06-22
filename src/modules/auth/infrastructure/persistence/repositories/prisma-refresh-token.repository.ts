import { Injectable } from '@nestjs/common';
import type { TransactionScope } from '@shared/domain/transactions';
import { unwrapPrismaTxFromScope } from '@shared/infrastructure/persistence/transactions';
import { PrismaService } from '@shared/infrastructure/persistence/prisma/prisma.service';
import type { IRefreshTokenEntity } from 'src/modules/auth/domain/entities/refresh-token';
import type {
  IRefreshTokenRecord,
  IRefreshTokenRepository,
} from 'src/modules/auth/domain/repositories/i-refresh-token.repository';

@Injectable()
export class PrismaRefreshTokenRepository implements IRefreshTokenRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    payload: {
      userId: string;
      tokenHash: string;
      expiresAt: Date;
    },
    scope: TransactionScope,
  ): Promise<IRefreshTokenRecord> {
    const tx = unwrapPrismaTxFromScope(scope);
    const row = await tx.refreshToken.create({
      data: {
        userId: payload.userId,
        tokenHash: payload.tokenHash,
        expiresAt: payload.expiresAt,
      },
    });

    return this.mapRow(row);
  }

  async findByHash(tokenHash: string): Promise<IRefreshTokenRecord | null> {
    const row = await this.prisma.refreshToken.findFirst({
      where: { tokenHash, deletedAt: null },
      orderBy: { createdAt: 'desc' },
    });

    return row ? this.mapRow(row) : null;
  }

  async revokeById(tokenId: string, scope: TransactionScope): Promise<void> {
    const tx = unwrapPrismaTxFromScope(scope);
    await tx.refreshToken.update({
      where: { id: tokenId },
      data: { revokedAt: new Date() },
    });
  }

  async revokeAllForUser(userId: string, scope: TransactionScope): Promise<void> {
    const tx = unwrapPrismaTxFromScope(scope);
    await tx.refreshToken.updateMany({
      where: {
        userId,
        revokedAt: null,
        deletedAt: null,
      },
      data: { revokedAt: new Date() },
    });
  }

  private mapRow(row: IRefreshTokenEntity): IRefreshTokenRecord {
    return {
      id: row.id,
      userId: row.userId,
      tokenHash: row.tokenHash,
      expiresAt: row.expiresAt,
      revokedAt: row.revokedAt,
    };
  }
}
