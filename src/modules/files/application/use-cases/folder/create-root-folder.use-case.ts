import type { IFolderEntity } from '../../../domain/entities/folder';
import type { IFolderRepository } from '../../../domain/repositories/folder/i-folder.repository';
import type { ICreateRootFolderApplicationInput } from '../../dtos/folder/create-root-folder.input';
import type { ICreateRootFolderApplicationOutput } from '../../dtos/folder/create-root-folder.output';

export class CreateRootFolderUseCase {
  constructor(private readonly folderRepository: IFolderRepository) {}

  async execute(
    input: ICreateRootFolderApplicationInput,
  ): Promise<ICreateRootFolderApplicationOutput> {
    const existing = await this.folderRepository.findByOwnerAndPath(
      input.ownerKind,
      input.ownerId,
      '/',
    );
    if (existing) {
      return existing;
    }

    return this.folderRepository.create({
      ownerKind: input.ownerKind,
      ownerId: input.ownerId,
      createdBy: input.actor.userId,
      name: 'root',
      parentId: null,
      path: '/',
      depth: 0,
      isSystem: true,
      allowedPurposes: [],
    });
  }
}
