import { PrismaTransactionManager } from '@shared/infrastructure/persistence/transactions';
import type { PrismaService } from '@shared/infrastructure/persistence/prisma/prisma.service';

describe('PrismaTransactionManager', () => {
  it('wraps prisma.$transaction and passes scope to callback', async () => {
    const tx = { marker: 'tx' };
    const prisma = {
      $transaction: jest.fn(async (fn: (client: typeof tx) => Promise<unknown>) =>
        fn(tx),
      ),
    } as unknown as PrismaService;

    const manager = new PrismaTransactionManager(prisma);
    const work = jest.fn(async () => 'done');

    const result = await manager.runInTransaction(work);

    expect(result).toBe('done');
    expect(prisma.$transaction).toHaveBeenCalledTimes(1);
    expect(work).toHaveBeenCalledWith(expect.anything());
  });
});
