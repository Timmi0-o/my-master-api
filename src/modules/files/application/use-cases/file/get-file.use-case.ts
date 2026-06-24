import type { IGetFileApplicationInput } from '../../dtos/file/get-file.input';
import type { IGetFileApplicationOutput } from '../../dtos/file/get-file.output';
import { FileNotFoundError } from '../../../domain/entities/file';
import {
  ensureFileAccessible,
  ensureFileExists,
} from '../../../domain/entities/file/policies';
import type { IFileAccessRepository } from '../../../domain/repositories/file-access/i-file-access.repository';
import type { IFileShareRepository } from '../../../domain/repositories/file-share/i-file-share.repository';
import type { IFileRepository } from '../../../domain/repositories/file/i-file.repository';

export class GetFileUseCase {
  constructor(
    private readonly fileRepository: IFileRepository,
    private readonly fileAccessRepository: IFileAccessRepository,
    private readonly fileShareRepository: IFileShareRepository,
  ) {}

  async execute(
    input: IGetFileApplicationInput,
  ): Promise<IGetFileApplicationOutput> {
    const entity = await this.fileRepository.findEntityById(input.fileId);
    ensureFileExists(entity, input.fileId);
    await ensureFileAccessible(entity, input.actor, {
      fileAccessRepository: this.fileAccessRepository,
      fileShareRepository: this.fileShareRepository,
    });

    const item = await this.fileRepository.findOne(input.fileId, input.params);
    if (!item) {
      throw new FileNotFoundError(input.fileId);
    }

    return item;
  }
}
