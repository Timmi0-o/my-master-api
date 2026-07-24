import { DomainError } from '@shared/domain/errors';
import type { ImageEntityType } from '../image-entity-type.enum';

export class UnsupportedImageEntityTypeError extends DomainError {
  constructor(entityType: string) {
    super(
      'UNSUPPORTED_IMAGE_ENTITY_TYPE',
      `Unsupported image entity type: ${entityType}`,
      { entityType },
    );
  }
}
