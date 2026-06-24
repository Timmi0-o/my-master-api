import type { IMoveFileApplicationInput } from '../../dtos/file/move-file.input';
import type { IMoveFileApplicationOutput } from '../../dtos/file/move-file.output';
import { FileNotFoundError } from '../../../domain/entities/file';
import {
  ensureFileExists,
  ensureFileModifiable,
} from '../../../domain/entities/file/policies';
import type { IFolderRepository } from '../../../domain/repositories/folder/i-folder.repository';
import type { IFileAccessRepository } from '../../../domain/repositories/file-access/i-file-access.repository';
import type { IFileRepository } from '../../../domain/repositories/file/i-file.repository';

export class MoveFileUseCase {
  constructor(
    private readonly fileRepository: IFileRepository,
    private readonly folderRepository: IFolderRepository,
    private readonly fileAccessRepository: IFileAccessRepository,
  ) {}

  async execute(
    input: IMoveFileApplicationInput,
  ): Promise<IMoveFileApplicationOutput> {
    const file = await this.fileRepository.findEntityById(input.fileId);
    ensureFileExists(file, input.fileId);
    await ensureFileModifiable(file, input.actor, this.fileAccessRepository);

    if (input.folderId) {
      const folder = await this.folderRepository.findById(input.folderId);
      if (!folder) {
        throw new FileNotFoundError(input.folderId);
      }
    }

    return this.fileRepository.update(input.fileId, {
      folderId: input.folderId,
    });
  }
}
