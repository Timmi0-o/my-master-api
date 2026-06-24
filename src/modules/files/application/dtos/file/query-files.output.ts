import type { IFilePublicEntity } from 'src/modules/files/domain/entities/file';

export interface IQueryFilesApplicationOutput {
  data: IFilePublicEntity[];
  meta: { total: number };
}
