import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/shared/infrastructure/persistence/prisma/prisma.service';
import type { ISessionRepository } from 'src/modules/auth/domain/repositories/i-session.repository';

@Injectable()
export class PrismaSessionRepository implements ISessionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(payload: {
    userId: string;
    ipAddress?: string | null;
    userAgent?: string | null;
  }): Promise<void> {
    await this.prisma.session.create({
      data: {
        userId: payload.userId,
        ipAddress: payload.ipAddress ?? null,
        userAgent: payload.userAgent ?? null,
      },
    });
  }
}
