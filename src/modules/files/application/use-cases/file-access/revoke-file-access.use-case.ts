import { FileNotFoundError } from '../../../domain/entities/file';
import {
  ensureFileExists,
  ensureFileModifiable,
} from '../../../domain/entities/file/policies';
import type { IFileAccessRepository } from '../../../domain/repositories/file-access/i-file-access.repository';
import type { IFileRepository } from '../../../domain/repositories/file/i-file.repository';
import type { IRevokeFileAccessApplicationInput } from '../../dtos/file-access/revoke-file-access.input';

export class RevokeFileAccessUseCase {
  constructor(
    private readonly fileRepository: IFileRepository,
    private readonly fileAccessRepository: IFileAccessRepository,
  ) {}

  async execute(input: IRevokeFileAccessApplicationInput): Promise<void> {
    const file = await this.fileRepository.findEntityById(input.fileId);
    ensureFileExists(file, input.fileId);
    await ensureFileModifiable(file, input.actor, this.fileAccessRepository);

    const access = await this.fileAccessRepository.findById(input.accessId);
    if (!access || access.fileId !== input.fileId) {
      throw new FileNotFoundError(input.accessId);
    }

    await this.fileAccessRepository.delete(access.id);
  }
}
