import type { IFilePublicEntity } from 'src/modules/files/domain/entities/file';

export interface ICreateFilesApplicationOutput {
  files: IFilePublicEntity[];
}
