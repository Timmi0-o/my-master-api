import {
  FolderConflictError,
  FolderForbiddenError,
  FolderNotFoundError,
} from '../../../domain/entities/folder';
import type { IFolderRepository } from '../../../domain/repositories/folder/i-folder.repository';
import type { IUpdateFolderApplicationInput } from '../../dtos/folder/update-folder.input';
import type { IUpdateFolderApplicationOutput } from '../../dtos/folder/update-folder.output';

export class UpdateFolderUseCase {
  constructor(private readonly folderRepository: IFolderRepository) {}

  async execute(
    input: IUpdateFolderApplicationInput,
  ): Promise<IUpdateFolderApplicationOutput> {
    const folder = await this.folderRepository.findById(input.folderId);
    if (!folder || folder.deletedAt) {
      throw new FolderNotFoundError(input.folderId);
    }

    if (folder.isSystem) {
      throw new FolderForbiddenError('Системную папку нельзя изменить');
    }

    if (!input.name) {
      return this.folderRepository.update(input.folderId, {
        allowedPurposes: input.allowedPurposes,
      });
    }

    const parentPath =
      folder.path === `/${folder.name}`
        ? '/'
        : folder.path.slice(0, folder.path.lastIndexOf('/')) || '/';
    const newPath =
      parentPath === '/' ? `/${input.name}` : `${parentPath}/${input.name}`;

    const existing = await this.folderRepository.findByOwnerAndPath(
      folder.ownerKind,
      folder.ownerId,
      newPath,
    );
    if (existing && existing.id !== folder.id) {
      throw new FolderConflictError('Папка с таким именем уже существует');
    }

    return this.folderRepository.update(input.folderId, {
      name: input.name,
      path: newPath,
      allowedPurposes: input.allowedPurposes,
    });
  }
}
