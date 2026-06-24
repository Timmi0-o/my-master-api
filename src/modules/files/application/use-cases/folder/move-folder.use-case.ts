import {
  FolderConflictError,
  FolderForbiddenError,
  FolderNotFoundError,
} from '../../../domain/entities/folder';
import type { IFolderRepository } from '../../../domain/repositories/folder/i-folder.repository';
import type { IMoveFolderApplicationInput } from '../../dtos/folder/move-folder.input';
import type { IMoveFolderApplicationOutput } from '../../dtos/folder/move-folder.output';

export class MoveFolderUseCase {
  constructor(private readonly folderRepository: IFolderRepository) {}

  async execute(
    input: IMoveFolderApplicationInput,
  ): Promise<IMoveFolderApplicationOutput> {
    const folder = await this.folderRepository.findById(input.folderId);
    if (!folder || folder.deletedAt) {
      throw new FolderNotFoundError(input.folderId);
    }
    if (folder.isSystem) {
      throw new FolderForbiddenError('Системную папку нельзя переместить');
    }

    const parent = await this.folderRepository.findById(input.parentId);
    if (!parent || parent.deletedAt) {
      throw new FolderNotFoundError(input.parentId);
    }

    if (parent.id === folder.id || parent.path.startsWith(`${folder.path}/`)) {
      throw new FolderForbiddenError(
        'Нельзя переместить папку в себя или потомка',
      );
    }

    const oldPath = folder.path;
    const newPath =
      parent.path === '/'
        ? `/${folder.name}`
        : `${parent.path}/${folder.name}`;

    const existing = await this.folderRepository.findByOwnerAndPath(
      folder.ownerKind,
      folder.ownerId,
      newPath,
    );
    if (existing && existing.id !== folder.id) {
      throw new FolderConflictError('Папка с таким именем уже существует');
    }

    const descendants = await this.folderRepository.findManyByOwner(
      folder.ownerKind,
      folder.ownerId,
    );

    const depthDelta = parent.depth + 1 - folder.depth;
    const updates = descendants
      .filter(
        (item) =>
          item.id !== folder.id &&
          (item.path === oldPath || item.path.startsWith(`${oldPath}/`)),
      )
      .map((item) => ({
        id: item.id,
        path: item.path.replace(oldPath, newPath),
        depth: item.depth + depthDelta,
      }));

    await this.folderRepository.update(folder.id, {
      parentId: parent.id,
      path: newPath,
      depth: parent.depth + 1,
    });

    for (const update of updates) {
      await this.folderRepository.update(update.id, {
        path: update.path,
        depth: update.depth,
      });
    }

    const moved = await this.folderRepository.findById(folder.id);
    if (!moved) {
      throw new FolderNotFoundError(folder.id);
    }
    return moved;
  }
}
