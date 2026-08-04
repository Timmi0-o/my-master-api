import { Injectable } from '@nestjs/common';
import { PrismaService } from '@shared/infrastructure/persistence/prisma/prisma.service';
import type {
  ICreateUserServiceInteractionInput,
  IUserServiceInteractionEntity,
} from 'src/modules/feed/domain/entities/user-service-interaction';
import type { EUserServiceInteractionType } from 'src/modules/feed/domain/entities/user-service-interaction';
import type { IUserServiceInteractionRepository } from 'src/modules/feed/domain/repositories/user-service-interaction';

@Injectable()
export class PrismaUserServiceInteractionRepository
  implements IUserServiceInteractionRepository
{
  constructor(private readonly prismaService: PrismaService) {}

  async createMany(
    inputs: ICreateUserServiceInteractionInput[],
  ): Promise<IUserServiceInteractionEntity[]> {
    if (inputs.length === 0) {
      return [];
    }

    const created = await this.prismaService.$transaction(
      inputs.map((input) =>
        this.prismaService.userServiceInteraction.create({
          data: {
            userId: input.userId,
            masterServiceId: input.masterServiceId,
            type: input.type,
          },
        }),
      ),
    );

    return created.map((row) => ({
      id: row.id,
      userId: row.userId,
      masterServiceId: row.masterServiceId,
      type: row.type as EUserServiceInteractionType,
      createdAt: row.createdAt,
    }));
  }

  async findRecentDuplicate(
    userId: string,
    masterServiceId: string,
    type: EUserServiceInteractionType,
    since: Date,
  ): Promise<IUserServiceInteractionEntity | null> {
    const row = await this.prismaService.userServiceInteraction.findFirst({
      where: {
        userId,
        masterServiceId,
        type,
        createdAt: { gte: since },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!row) {
      return null;
    }

    return {
      id: row.id,
      userId: row.userId,
      masterServiceId: row.masterServiceId,
      type: row.type as EUserServiceInteractionType,
      createdAt: row.createdAt,
    };
  }

  async findRecentByUserId(
    userId: string,
    since: Date,
    limit = 200,
  ): Promise<IUserServiceInteractionEntity[]> {
    const rows = await this.prismaService.userServiceInteraction.findMany({
      where: {
        userId,
        createdAt: { gte: since },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    return rows.map((row) => ({
      id: row.id,
      userId: row.userId,
      masterServiceId: row.masterServiceId,
      type: row.type as EUserServiceInteractionType,
      createdAt: row.createdAt,
    }));
  }
}
