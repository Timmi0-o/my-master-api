import type { IGetFolderApplicationInput } from '../../dtos/folder/get-folder.input';
import type { IGetFolderApplicationOutput } from '../../dtos/folder/get-folder.output';
import { FolderNotFoundError } from '../../../domain/entities/folder';
import type { IFolderRepository } from '../../../domain/repositories/folder/i-folder.repository';

export class GetFolderUseCase {
  constructor(private readonly folderRepository: IFolderRepository) {}

  async execute(
    input: IGetFolderApplicationInput,
  ): Promise<IGetFolderApplicationOutput> {
    const folder = await this.folderRepository.findByOwnerAndPath(
      input.ownerKind,
      input.ownerId,
      input.path,
    );
    if (!folder || folder.deletedAt) {
      throw new FolderNotFoundError(
        `${input.ownerKind}:${input.ownerId}:${input.path}`,
      );
    }
    return folder;
  }
}
