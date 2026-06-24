import type { ICreateFilesApplicationInput } from '../../dtos/file/create-files.input';
import type { ICreateFilesApplicationOutput } from '../../dtos/file/create-files.output';
import { FileNotFoundError, type IFileEntity } from '../../../domain/entities/file';
import type { IFolderRepository } from '../../../domain/repositories/folder/i-folder.repository';
import type { IFileRepository } from '../../../domain/repositories/file/i-file.repository';

export class CreateFilesUseCase {
  constructor(
    private readonly fileRepository: IFileRepository,
    private readonly folderRepository: IFolderRepository,
  ) {}

  async execute(
    input: ICreateFilesApplicationInput,
  ): Promise<ICreateFilesApplicationOutput> {
    const created: IFileEntity[] = [];

    for (const fileInput of input.files) {
      if (fileInput.folderId) {
        const folder = await this.folderRepository.findById(fileInput.folderId);
        if (!folder) {
          throw new FileNotFoundError(fileInput.folderId);
        }
      }

      const file = await this.fileRepository.create({
        ...fileInput,
        uploadedBy: fileInput.uploadedBy || input.actor.userId,
      });
      created.push(file);
    }

    return { files: created };
  }
}
