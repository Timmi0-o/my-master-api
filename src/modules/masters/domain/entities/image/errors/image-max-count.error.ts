import { DomainError } from '@shared/domain/errors';
import type { ImageEntityType } from '../image-entity-type.enum';

export class ImageMaxCountError extends DomainError {
  constructor(
    entityType: ImageEntityType,
    maxCount: number,
    currentCount: number,
    newImagesCount: number,
  ) {
    super(
      'IMAGE_MAX_COUNT',
      `Entity cannot have more than ${maxCount} images`,
      {
        entityType,
        maxCount,
        currentCount,
        newImagesCount,
      },
    );
  }
}
