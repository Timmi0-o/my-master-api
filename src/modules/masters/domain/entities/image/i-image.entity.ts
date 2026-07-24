import type { IFilePublicEntity } from 'src/modules/files/domain/entities/file';
import type { ImageEntityType } from './image-entity-type.enum';

export interface IImageEntity {
  id: string;
  entityType: ImageEntityType;
  entityId: string;
  fileId: string;
  createdAt: Date;
  updatedAt: Date;
}

export type IImagePublicEntity = IImageEntity & {
  file?: IFilePublicEntity;
};
