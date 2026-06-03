import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/shared/infrastructure/persistence/prisma/prisma.service';
import type {
  IRefreshTokenRecord,
  IRefreshTokenRepository,
} from 'src/modules/auth/domain/repositories/i-refresh-token.repository';

@Injectable()
export class PrismaRefreshTokenRepository implements IRefreshTokenRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(payload: {
    userId: string;
    tokenHash: string;
    expiresAt: Date;
  }): Promise<IRefreshTokenRecord> {
    const row = await this.prisma.refreshToken.create({
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

  async revokeById(tokenId: string): Promise<void> {
    await this.prisma.refreshToken.update({
      where: { id: tokenId },
      data: { revokedAt: new Date() },
    });
  }

  async revokeAllForUser(userId: string): Promise<void> {
    await this.prisma.refreshToken.updateMany({
      where: {
        userId,
        revokedAt: null,
        deletedAt: null,
      },
      data: { revokedAt: new Date() },
    });
  }

  private mapRow(row: {
    id: string;
    userId: string;
    tokenHash: string;
    expiresAt: Date;
    revokedAt: Date | null;
  }): IRefreshTokenRecord {
    return {
      id: row.id,
      userId: row.userId,
      tokenHash: row.tokenHash,
      expiresAt: row.expiresAt,
      revokedAt: row.revokedAt,
    };
  }
}
