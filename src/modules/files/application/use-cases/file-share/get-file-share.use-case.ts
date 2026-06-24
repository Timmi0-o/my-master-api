import { createHash } from 'crypto';
import {
  FileShareForbiddenError,
  FileShareNotFoundError,
} from '../../../domain/entities/file';
import type { IFileRepository } from '../../../domain/repositories/file/i-file.repository';
import type { IFileShareRepository } from '../../../domain/repositories/file-share/i-file-share.repository';
import type { IGetFileShareApplicationInput } from '../../dtos/file-share/get-file-share.input';
import type { IGetFileShareApplicationOutput } from '../../dtos/file-share/get-file-share.output';

export class GetFileShareUseCase {
  constructor(
    private readonly fileShareRepository: IFileShareRepository,
    private readonly fileRepository: IFileRepository,
  ) {}

  async execute(
    input: IGetFileShareApplicationInput,
  ): Promise<IGetFileShareApplicationOutput> {
    const share = await this.fileShareRepository.findByToken(input.token);
    if (!share) {
      throw new FileShareNotFoundError(input.token);
    }

    if (share.expiresAt && share.expiresAt < new Date()) {
      throw new FileShareForbiddenError('Ссылка истекла');
    }

    if (share.maxViews != null && share.views >= share.maxViews) {
      throw new FileShareForbiddenError('Превышен лимит просмотров');
    }

    if (
      share.allowedIps.length > 0 &&
      input.clientIp &&
      !share.allowedIps.includes(input.clientIp)
    ) {
      throw new FileShareForbiddenError('IP не разрешён');
    }

    if (share.password) {
      const provided = input.password
        ? createHash('sha256').update(input.password).digest('hex')
        : null;
      const stored = createHash('sha256').update(share.password).digest('hex');
      if (provided !== stored) {
        throw new FileShareForbiddenError('Неверный пароль');
      }
    }

    const file = await this.fileRepository.findEntityById(share.fileId);
    if (!file || file.deletedAt) {
      throw new FileShareNotFoundError(input.token);
    }

    await this.fileShareRepository.update(share.id, {
      views: share.views + 1,
      lastAccessAt: new Date(),
    });

    return { share, file };
  }
}
