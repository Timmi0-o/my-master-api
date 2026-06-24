import {
  FolderConflictError,
  FolderNotFoundError,
  type IFolderEntity,
} from '../../../domain/entities/folder';
import type { IFolderRepository } from '../../../domain/repositories/folder/i-folder.repository';
import type { ICreateFolderApplicationInput } from '../../dtos/folder/create-folder.input';
import type { ICreateFolderApplicationOutput } from '../../dtos/folder/create-folder.output';

export class CreateFolderUseCase {
  constructor(private readonly folderRepository: IFolderRepository) {}

  async execute(
    input: ICreateFolderApplicationInput,
  ): Promise<ICreateFolderApplicationOutput> {
    const { parentFolder, resolvedParentId } =
      await this.resolveParentFolder(input);
    const { path, depth } = this.calculatePathAndDepth(input.name, parentFolder);

    const existing = await this.folderRepository.findByOwnerAndPath(
      input.ownerKind,
      input.ownerId,
      path,
    );
    if (existing) {
      throw new FolderConflictError('Папка с таким именем уже существует');
    }

    return this.folderRepository.create({
      ownerKind: input.ownerKind,
      ownerId: input.ownerId,
      createdBy: input.actor.userId,
      name: input.name,
      parentId: resolvedParentId,
      path,
      depth,
      allowedPurposes: input.allowedPurposes ?? [],
    });
  }

  private async resolveParentFolder(input: ICreateFolderApplicationInput) {
    if (input.parentId) {
      const parentFolder = await this.folderRepository.findById(input.parentId);
      if (!parentFolder) {
        throw new FolderNotFoundError(input.parentId);
      }
      return { parentFolder, resolvedParentId: input.parentId };
    }

    const rootFolder = await this.folderRepository.findByOwnerAndPath(
      input.ownerKind,
      input.ownerId,
      '/',
    );
    return {
      parentFolder: rootFolder,
      resolvedParentId: rootFolder?.id ?? null,
    };
  }

  private calculatePathAndDepth(
    name: string,
    parentFolder: IFolderEntity | null,
  ): { path: string; depth: number } {
    if (!parentFolder) {
      return { path: `/${name}`, depth: 1 };
    }

    const parentPath = parentFolder.path === '/' ? '' : parentFolder.path;
    return {
      path: parentPath ? `${parentPath}/${name}` : `/${name}`,
      depth: parentFolder.depth + 1,
    };
  }
}
