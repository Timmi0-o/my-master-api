import type { IFileRepository } from '../../../domain/repositories/file/i-file.repository';
import type { IEnqueueImageVariantsBackfillApplicationInput } from '../../dtos/file/enqueue-image-variants-backfill.input';
import type { IEnqueueImageVariantsBackfillApplicationOutput } from '../../dtos/file/enqueue-image-variants-backfill.output';
import type { IImageVariantsQueuePort } from '../../ports/i-image-variants-queue.port';

const DEFAULT_PAGE_SIZE = 100;

export class EnqueueImageVariantsBackfillUseCase {
  constructor(
    private readonly fileRepository: IFileRepository,
    private readonly imageVariantsQueue: IImageVariantsQueuePort,
  ) {}

  async execute(
    input: IEnqueueImageVariantsBackfillApplicationInput,
  ): Promise<IEnqueueImageVariantsBackfillApplicationOutput> {
    const pageSize = input.pageSize ?? DEFAULT_PAGE_SIZE;
    let cursorId: string | null = null;
    let scannedCount = 0;
    let enqueuedCount = 0;

    for (;;) {
      const page = await this.fileRepository.findImageFileIdsPage({
        take: pageSize,
        cursorId,
      });

      if (page.ids.length === 0) {
        break;
      }

      scannedCount += page.ids.length;

      for (const fileId of page.ids) {
        await this.imageVariantsQueue.enqueueProcessImageVariants({
          fileId,
          force: input.force,
        });
        enqueuedCount += 1;
      }

      if (!page.nextCursorId) {
        break;
      }

      cursorId = page.nextCursorId;
    }

    return { scannedCount, enqueuedCount };
  }
}
