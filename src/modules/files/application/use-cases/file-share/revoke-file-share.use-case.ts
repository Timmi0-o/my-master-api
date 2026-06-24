import { FileNotFoundError } from '../../../domain/entities/file';
import {
  ensureFileExists,
  ensureFileModifiable,
} from '../../../domain/entities/file/policies';
import type { IFileAccessRepository } from '../../../domain/repositories/file-access/i-file-access.repository';
import type { IFileRepository } from '../../../domain/repositories/file/i-file.repository';
import type { IFileShareRepository } from '../../../domain/repositories/file-share/i-file-share.repository';
import type { IRevokeFileShareApplicationInput } from '../../dtos/file-share/revoke-file-share.input';

export class RevokeFileShareUseCase {
  constructor(
    private readonly fileShareRepository: IFileShareRepository,
    private readonly fileRepository: IFileRepository,
    private readonly fileAccessRepository: IFileAccessRepository,
  ) {}

  async execute(input: IRevokeFileShareApplicationInput): Promise<void> {
    const share = await this.fileShareRepository.findById(input.shareId);
    if (!share) {
      throw new FileNotFoundError(input.shareId);
    }

    const file = await this.fileRepository.findEntityById(share.fileId);
    ensureFileExists(file, share.fileId);
    await ensureFileModifiable(file, input.actor, this.fileAccessRepository);

    await this.fileShareRepository.delete(share.id);
  }
}
