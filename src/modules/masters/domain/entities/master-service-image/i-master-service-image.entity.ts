import type { IFilePublicEntity } from 'src/modules/files/domain/entities/file';

export interface IMasterServiceImageEntity {
  id: string;
  masterServiceId: string;
  fileId: string;
  createdAt: Date;
  updatedAt: Date;
}

export type IMasterServiceImagePublicEntity = IMasterServiceImageEntity & {
  file?: IFilePublicEntity;
};
