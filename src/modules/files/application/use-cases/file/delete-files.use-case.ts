import type { IDeleteFilesApplicationInput } from '../../dtos/file/delete-files.input';
import type { IDeleteFilesApplicationOutput } from '../../dtos/file/delete-files.output';
import {
  ensureFileExists,
  ensureFileModifiable,
} from '../../../domain/entities/file/policies';
import type { IFileAccessRepository } from '../../../domain/repositories/file-access/i-file-access.repository';
import type { IFileRepository } from '../../../domain/repositories/file/i-file.repository';

export class DeleteFilesUseCase {
  constructor(
    private readonly fileRepository: IFileRepository,
    private readonly fileAccessRepository: IFileAccessRepository,
  ) {}

  async execute(
    input: IDeleteFilesApplicationInput,
  ): Promise<IDeleteFilesApplicationOutput> {
    const allowedIds: string[] = [];

    for (const fileId of input.fileIds) {
      const file = await this.fileRepository.findEntityById(fileId);
      ensureFileExists(file, fileId);
      await ensureFileModifiable(file, input.actor, this.fileAccessRepository);
      allowedIds.push(fileId);
    }

    const count = await this.fileRepository.softDeleteMany(allowedIds);
    return { count };
  }
}
