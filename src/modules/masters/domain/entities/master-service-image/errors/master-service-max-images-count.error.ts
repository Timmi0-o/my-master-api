import { DomainError } from '@shared/domain/errors';

export class MasterServiceMaxImagesCountError extends DomainError {
  constructor(maxCount: number, currentCount: number, newImagesCount: number) {
    super(
      'MASTER_SERVICE_MAX_IMAGES_COUNT',
      `Master service cannot have more than ${maxCount} images`,
      {
        maxCount,
        currentCount,
        newImagesCount,
      },
    );
  }
}
