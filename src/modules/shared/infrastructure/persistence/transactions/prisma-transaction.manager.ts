import type {
  ITransactionManager,
  TransactionScope,
} from '@shared/domain/transactions';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { wrapPrismaTxAsScope } from './prisma-transaction-scope';

@Injectable()
export class PrismaTransactionManager implements ITransactionManager {
  constructor(private readonly prisma: PrismaService) {}

  async runInTransaction<T>(
    work: (scope: TransactionScope) => Promise<T>,
  ): Promise<T> {
    return this.prisma.$transaction(async (tx) => work(wrapPrismaTxAsScope(tx)));
  }
}
