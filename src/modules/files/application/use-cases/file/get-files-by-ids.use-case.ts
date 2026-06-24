import type { IGetFilesByIdsApplicationInput } from '../../dtos/file/get-files-by-ids.input';
import type { IGetFilesByIdsApplicationOutput } from '../../dtos/file/get-files-by-ids.output';
import { isFileAccessible } from '../../../domain/entities/file/policies/ensure-file-accessible.policy';
import type { IFileEntity } from '../../../domain/entities/file';
import type { IFileAccessRepository } from '../../../domain/repositories/file-access/i-file-access.repository';
import type { IFileShareRepository } from '../../../domain/repositories/file-share/i-file-share.repository';
import type { IFileRepository } from '../../../domain/repositories/file/i-file.repository';

export class GetFilesByIdsUseCase {
  constructor(
    private readonly fileRepository: IFileRepository,
    private readonly fileAccessRepository: IFileAccessRepository,
    private readonly fileShareRepository: IFileShareRepository,
  ) {}

  async execute(
    input: IGetFilesByIdsApplicationInput,
  ): Promise<IGetFilesByIdsApplicationOutput> {
    const files = await this.fileRepository.findEntitiesByIds(input.fileIds);
    const accessible: IFileEntity[] = [];

    for (const file of files) {
      const allowed = await isFileAccessible(file, input.actor, {
        fileAccessRepository: this.fileAccessRepository,
        fileShareRepository: this.fileShareRepository,
      });
      if (allowed) {
        accessible.push(file);
      }
    }

    return { files: accessible };
  }
}
