import type { ImageEntityType } from './image-entity-type.enum';

export interface ICreateImageInput {
  entityType: ImageEntityType;
  entityId: string;
  fileId: string;
}
