import type { IDeleteFilesApplicationInput } from '../../dtos/file/delete-files.input';
import type { IDeleteFilesApplicationOutput } from '../../dtos/file/delete-files.output';
import {
  ensureFileExists,
  ensureFileModifiable,
  listImageVariantFileUrlsFromMetadata,
} from '../../../domain/entities/file/policies';
import type { IFileAccessRepository } from '../../../domain/repositories/file-access/i-file-access.repository';
import type { IFileRepository } from '../../../domain/repositories/file/i-file.repository';
import type { IObjectStoragePort } from '../../ports/i-object-storage.port';
import { parseS3Url } from '../../../infrastructure/utils/parse-s3-url';

export class DeleteFilesUseCase {
  constructor(
    private readonly fileRepository: IFileRepository,
    private readonly fileAccessRepository: IFileAccessRepository,
    private readonly objectStorage: IObjectStoragePort,
  ) {}

  async execute(
    input: IDeleteFilesApplicationInput,
  ): Promise<IDeleteFilesApplicationOutput> {
    const allowedIds: string[] = [];

    for (const fileId of input.fileIds) {
      const file = await this.fileRepository.findEntityById(fileId);
      ensureFileExists(file, fileId);
      await ensureFileModifiable(file, input.actor, this.fileAccessRepository);

      const variantFileUrls = listImageVariantFileUrlsFromMetadata(
        file.metadata,
      );
      for (const variantFileUrl of variantFileUrls) {
        const parsed = parseS3Url(variantFileUrl);
        if (!parsed) {
          continue;
        }
        try {
          await this.objectStorage.deleteObject(
            parsed.key,
            parsed.bucket ?? this.objectStorage.getDefaultBucket(),
          );
        } catch {
          // Soft-delete should still succeed if a derivative object is already gone.
        }
      }

      allowedIds.push(fileId);
    }

    const count = await this.fileRepository.softDeleteMany(allowedIds);
    return { count };
  }
}
