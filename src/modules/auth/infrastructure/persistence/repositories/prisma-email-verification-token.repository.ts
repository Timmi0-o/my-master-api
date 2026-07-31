import { Injectable } from '@nestjs/common';
import type { TransactionScope } from '@shared/domain/transactions';
import { PrismaService } from '@shared/infrastructure/persistence/prisma/prisma.service';
import { unwrapPrismaTxFromScope } from '@shared/infrastructure/persistence/transactions';
import type { IEmailVerificationTokenEntity } from 'src/modules/auth/domain/entities/email-verification-token';
import type {
  IEmailVerificationTokenRecord,
  IEmailVerificationTokenRepository,
} from 'src/modules/auth/domain/repositories/i-email-verification-token.repository';

@Injectable()
export class PrismaEmailVerificationTokenRepository implements IEmailVerificationTokenRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    payload: {
      userId: string;
      tokenHash: string;
      expiresAt: Date;
    },
    scope?: TransactionScope,
  ): Promise<IEmailVerificationTokenRecord> {
    const client = scope ? unwrapPrismaTxFromScope(scope) : this.prisma;

    const row = await client.emailVerificationToken.create({
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
  ): Promise<IEmailVerificationTokenRecord | null> {
    const row = await this.prisma.emailVerificationToken.findUnique({
      where: { tokenHash },
    });

    return row ? this.mapRow(row) : null;
  }

  async deleteUnusedForUser(
    userId: string,
    scope?: TransactionScope,
  ): Promise<void> {
    const client = scope ? unwrapPrismaTxFromScope(scope) : this.prisma;

    await client.emailVerificationToken.deleteMany({
      where: {
        userId,
        usedAt: null,
      },
    });
  }

  async markUsed(tokenId: string, scope?: TransactionScope): Promise<void> {
    const client = scope ? unwrapPrismaTxFromScope(scope) : this.prisma;
    await client.emailVerificationToken.update({
      where: { id: tokenId },
      data: { usedAt: new Date() },
    });
  }

  private mapRow(
    row: IEmailVerificationTokenEntity,
  ): IEmailVerificationTokenRecord {
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
