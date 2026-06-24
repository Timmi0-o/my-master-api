import { FolderForbiddenError, FolderNotFoundError } from '../../../domain/entities/folder';
import type { IFileRepository } from '../../../domain/repositories/file/i-file.repository';
import type { IFolderRepository } from '../../../domain/repositories/folder/i-folder.repository';
import type { IDeleteFolderApplicationInput } from '../../dtos/folder/delete-folder.input';
import type { IDeleteFolderApplicationOutput } from '../../dtos/folder/delete-folder.output';

export class DeleteFolderUseCase {
  constructor(
    private readonly folderRepository: IFolderRepository,
    private readonly fileRepository: IFileRepository,
  ) {}

  async execute(
    input: IDeleteFolderApplicationInput,
  ): Promise<IDeleteFolderApplicationOutput> {
    const folder = await this.folderRepository.findById(input.folderId);
    if (!folder || folder.deletedAt) {
      throw new FolderNotFoundError(input.folderId);
    }
    if (folder.isSystem) {
      throw new FolderForbiddenError('Системную папку нельзя удалить');
    }

    const folderIds = await this.folderRepository.findIdsByPathPrefix(
      folder.ownerKind,
      folder.ownerId,
      folder.path,
    );

    const deletedFilesCount = await this.fileRepository.softDeleteByFolderIds(
      folderIds,
    );
    const deletedFoldersCount = await this.folderRepository.softDeleteMany(
      folderIds,
    );

    return { deletedFoldersCount, deletedFilesCount };
  }
}
