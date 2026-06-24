import type { IUpdateFileApplicationInput } from '../../dtos/file/update-file.input';
import type { IUpdateFileApplicationOutput } from '../../dtos/file/update-file.output';
import {
  ensureFileExists,
  ensureFileModifiable,
} from '../../../domain/entities/file/policies';
import type { IFileAccessRepository } from '../../../domain/repositories/file-access/i-file-access.repository';
import type { IFileRepository } from '../../../domain/repositories/file/i-file.repository';

export class UpdateFileUseCase {
  constructor(
    private readonly fileRepository: IFileRepository,
    private readonly fileAccessRepository: IFileAccessRepository,
  ) {}

  async execute(
    input: IUpdateFileApplicationInput,
  ): Promise<IUpdateFileApplicationOutput> {
    const file = await this.fileRepository.findEntityById(input.fileId);
    ensureFileExists(file, input.fileId);
    await ensureFileModifiable(file, input.actor, this.fileAccessRepository);

    return this.fileRepository.update(input.fileId, input.data);
  }
}
