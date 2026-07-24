import { DomainError } from '@shared/domain/errors';
import type { ImageEntityType } from '../image-entity-type.enum';

export class ImageNotFoundError extends DomainError {
  constructor(
    fileId: string,
    entityType: ImageEntityType,
    entityId: string,
  ) {
    super('IMAGE_NOT_FOUND', 'Image not found', {
      fileId,
      entityType,
      entityId,
    });
  }
}
