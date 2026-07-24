import { IMAGE_ENTITY_CONFIG } from '../image-entity-config';
import { ImageMaxCountError } from '../errors';
import type { ImageEntityType } from '../image-entity-type.enum';

export function ensureImageMaxCount(
  entityType: ImageEntityType,
  currentImagesCount: number,
  newImagesCount: number,
): void {
  const { maxCount } = IMAGE_ENTITY_CONFIG[entityType];

  if (currentImagesCount + newImagesCount > maxCount) {
    throw new ImageMaxCountError(
      entityType,
      maxCount,
      currentImagesCount,
      newImagesCount,
    );
  }
}
