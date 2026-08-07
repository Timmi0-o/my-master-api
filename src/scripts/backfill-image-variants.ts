/* eslint-disable no-console */
import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { EnqueueImageVariantsBackfillUseCase } from '../modules/files/application/use-cases/file/enqueue-image-variants-backfill.use-case';

async function main(): Promise<void> {
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['error', 'warn', 'log'],
  });

  try {
    const enqueueImageVariantsBackfillUseCase = app.get(
      EnqueueImageVariantsBackfillUseCase,
    );

    console.log(
      '[backfill:image-variants] Enqueueing ALL IMAGE files with force=true...',
    );

    const result = await enqueueImageVariantsBackfillUseCase.execute({
      force: true,
      pageSize: 100,
    });

    console.log(
      `[backfill:image-variants] Done. scanned=${result.scannedCount} enqueued=${result.enqueuedCount}`,
    );
    console.log(
      '[backfill:image-variants] Processing continues in BullMQ worker (running API process).',
    );
  } finally {
    await app.close();
  }
}

main().catch((error: unknown) => {
  console.error('[backfill:image-variants] Failed:', error);
  process.exit(1);
});
