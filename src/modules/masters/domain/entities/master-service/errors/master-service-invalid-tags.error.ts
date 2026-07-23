import { DomainError } from '@shared/domain/errors';
import {
  MASTER_SERVICE_TAGS_MAX_COUNT,
  MASTER_SERVICE_TAGS_MIN_COUNT,
} from '../master-service-tags.constants';

export class MasterServiceInvalidTagsError extends DomainError {
  constructor(message: string, context?: Record<string, unknown>) {
    super('MASTER_SERVICE_INVALID_TAGS', message, {
      minCount: MASTER_SERVICE_TAGS_MIN_COUNT,
      maxCount: MASTER_SERVICE_TAGS_MAX_COUNT,
      ...context,
    });
  }
}
