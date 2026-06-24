import { FileConflictError } from '../../../domain/entities/file';
import {
  ensureFileExists,
  ensureFileModifiable,
} from '../../../domain/entities/file/policies';
import type { IFileAccessRepository } from '../../../domain/repositories/file-access/i-file-access.repository';
import type { IFileRepository } from '../../../domain/repositories/file/i-file.repository';
import type { IGrantFileAccessApplicationInput } from '../../dtos/file-access/grant-file-access.input';
import type { IGrantFileAccessApplicationOutput } from '../../dtos/file-access/grant-file-access.output';

export class GrantFileAccessUseCase {
  constructor(
    private readonly fileRepository: IFileRepository,
    private readonly fileAccessRepository: IFileAccessRepository,
  ) {}

  async execute(
    input: IGrantFileAccessApplicationInput,
  ): Promise<IGrantFileAccessApplicationOutput> {
    const file = await this.fileRepository.findEntityById(input.fileId);
    ensureFileExists(file, input.fileId);
    await ensureFileModifiable(file, input.actor, this.fileAccessRepository);

    const existing = await this.fileAccessRepository.findByFileIdAndTarget(
      input.fileId,
      input.targetType,
      input.targetId,
    );
    if (existing) {
      throw new FileConflictError('Доступ для этой цели уже существует');
    }

    return this.fileAccessRepository.create({
      fileId: input.fileId,
      targetType: input.targetType,
      targetId: input.targetId,
      grantedBy: input.actor.userId,
      permissions: input.permissions,
      reason: input.reason ?? null,
      expiresAt: input.expiresAt ?? null,
    });
  }
}
