import { Injectable } from '@nestjs/common';
import type { Prisma } from '@prisma/client';
import type { TransactionScope } from '@shared/domain/transactions';
import { PrismaService } from '@shared/infrastructure/persistence/prisma/prisma.service';
import { unwrapPrismaTxFromScope } from '@shared/infrastructure/persistence/transactions';
import type {
  IBugReportEntity,
  ICreateBugReportInput,
} from 'src/modules/bug-reports/domain/entities/bug-report';
import type { IBugReportRepository } from 'src/modules/bug-reports/domain/repositories/bug-report';
import {
  mapBugReportRow,
  type BugReportRow,
} from '../../row-mappers/bug-report';

@Injectable()
export class PrismaBugReportRepository implements IBugReportRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findEntityById(
    id: string,
    scope?: TransactionScope,
  ): Promise<IBugReportEntity | null> {
    const client = scope
      ? unwrapPrismaTxFromScope(scope)
      : this.prismaService;

    const row = await client.bugReport.findUnique({ where: { id } });
    if (!row) {
      return null;
    }

    return mapBugReportRow(row as unknown as BugReportRow);
  }

  async create(
    input: ICreateBugReportInput,
    scope: TransactionScope,
  ): Promise<IBugReportEntity> {
    const tx = unwrapPrismaTxFromScope(scope);

    const row = await tx.bugReport.create({
      data: {
        reporterUserId: input.reporterUserId ?? null,
        replyEmail: input.replyEmail ?? null,
        title: input.title,
        description: input.description,
        deviceType: input.deviceType,
        pageUrl: input.pageUrl,
        appVersion: input.appVersion,
        locale: input.locale ?? null,
        deviceInfo: input.deviceInfo as unknown as Prisma.InputJsonValue,
      },
    });

    return mapBugReportRow(row as unknown as BugReportRow);
  }
}
