import { randomBytes } from 'crypto';
import { FileAccessLevel } from '../../../domain/entities/file';
import {
  ensureFileExists,
  ensureFileModifiable,
} from '../../../domain/entities/file/policies';
import type { IFileShareEntity } from '../../../domain/entities/file-share/i-file-share.entity';
import type { IFileAccessRepository } from '../../../domain/repositories/file-access/i-file-access.repository';
import type { IFileRepository } from '../../../domain/repositories/file/i-file.repository';
import type { IFileShareRepository } from '../../../domain/repositories/file-share/i-file-share.repository';
import type { ICreateFileShareApplicationInput } from '../../dtos/file-share/create-file-share.input';
import type { ICreateFileShareApplicationOutput } from '../../dtos/file-share/create-file-share.output';

export class CreateFileShareUseCase {
  constructor(
    private readonly fileRepository: IFileRepository,
    private readonly fileShareRepository: IFileShareRepository,
    private readonly fileAccessRepository: IFileAccessRepository,
  ) {}

  async execute(
    input: ICreateFileShareApplicationInput,
  ): Promise<ICreateFileShareApplicationOutput> {
    const file = await this.fileRepository.findEntityById(input.fileId);
    ensureFileExists(file, input.fileId);
    await ensureFileModifiable(file, input.actor, this.fileAccessRepository);

    const token = randomBytes(32).toString('hex');
    const share = await this.fileShareRepository.create({
      fileId: input.fileId,
      token,
      password: input.password ?? null,
      allowedIps: input.allowedIps ?? [],
      maxDownloads: input.maxDownloads ?? null,
      maxViews: input.maxViews ?? null,
      allowDownload: input.allowDownload ?? true,
      allowPreview: input.allowPreview ?? true,
      expiresAt: input.expiresAt ?? null,
      name: input.name ?? null,
      description: input.description ?? null,
      createdBy: input.actor.userId,
    });

    if (file.accessLevel !== FileAccessLevel.SHARED) {
      await this.fileRepository.update(file.id, {
        accessLevel: FileAccessLevel.SHARED,
      });
    }

    return share;
  }
}
