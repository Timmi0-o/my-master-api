import { Injectable } from '@nestjs/common';
import type { TransactionScope } from '@shared/domain/transactions';
import { PrismaService } from '@shared/infrastructure/persistence/prisma/prisma.service';
import { unwrapPrismaTxFromScope } from '@shared/infrastructure/persistence/transactions';
import type { IPasswordResetTokenEntity } from 'src/modules/auth/domain/entities/password-reset-token';
import type {
  IPasswordResetTokenRecord,
  IPasswordResetTokenRepository,
} from 'src/modules/auth/domain/repositories/i-password-reset-token.repository';

@Injectable()
export class PrismaPasswordResetTokenRepository implements IPasswordResetTokenRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    payload: {
      userId: string;
      tokenHash: string;
      expiresAt: Date;
    },
    scope?: TransactionScope,
  ): Promise<IPasswordResetTokenRecord> {
    const client = scope ? unwrapPrismaTxFromScope(scope) : this.prisma;

    const row = await client.passwordResetToken.create({
      data: {
        userId: payload.userId,
        tokenHash: payload.tokenHash,
        expiresAt: payload.expiresAt,
      },
    });

    return this.mapRow(row);
  }

  async findByHash(
    tokenHash: string,
  ): Promise<IPasswordResetTokenRecord | null> {
    const row = await this.prisma.passwordResetToken.findUnique({
      where: { tokenHash },
    });

    return row ? this.mapRow(row) : null;
  }

  async deleteUnusedForUser(
    userId: string,
    scope?: TransactionScope,
  ): Promise<void> {
    const client = scope ? unwrapPrismaTxFromScope(scope) : this.prisma;

    await client.passwordResetToken.deleteMany({
      where: {
        userId,
        usedAt: null,
      },
    });
  }

  async markUsed(tokenId: string, scope: TransactionScope): Promise<void> {
    const tx = unwrapPrismaTxFromScope(scope);
    await tx.passwordResetToken.update({
      where: { id: tokenId },
      data: { usedAt: new Date() },
    });
  }

  private mapRow(row: IPasswordResetTokenEntity): IPasswordResetTokenRecord {
    return {
      id: row.id,
      userId: row.userId,
      tokenHash: row.tokenHash,
      expiresAt: row.expiresAt,
      usedAt: row.usedAt,
      createdAt: row.createdAt,
    };
  }
}
