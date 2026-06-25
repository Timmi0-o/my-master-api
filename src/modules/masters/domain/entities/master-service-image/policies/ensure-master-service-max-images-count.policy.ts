import { MasterServiceMaxImagesCountError } from '../errors';
import { MASTER_SERVICE_MAX_IMAGES_COUNT } from '../master-service-image-upload.constants';

/**
 * Проверка, что количество изображений услуги не превышает лимит
 */
export function ensureMasterServiceMaxImagesCount(
  currentServiceImagesCount: number,
  newImagesCount: number,
): void {
  if (
    currentServiceImagesCount + newImagesCount >
    MASTER_SERVICE_MAX_IMAGES_COUNT
  ) {
    throw new MasterServiceMaxImagesCountError(
      MASTER_SERVICE_MAX_IMAGES_COUNT,
      currentServiceImagesCount,
      newImagesCount,
    );
  }
}
