import { MasterServiceInvalidTagsError } from '../errors/master-service-invalid-tags.error';
import {
  MASTER_SERVICE_TAG_MAX_LENGTH,
  MASTER_SERVICE_TAGS_MAX_COUNT,
  MASTER_SERVICE_TAGS_MIN_COUNT,
} from '../master-service-tags.constants';

/**
 * Normalizes and validates service tags.
 * Count must be between 5 and 30 (inclusive).
 */
export function ensureMasterServiceTagsValid(
  tags: readonly string[],
): string[] {
  const normalized = [
    ...new Set(
      tags
        .map((tag) => tag.trim().toLowerCase())
        .filter((tag) => tag.length > 0),
    ),
  ];

  if (
    normalized.length < MASTER_SERVICE_TAGS_MIN_COUNT ||
    normalized.length > MASTER_SERVICE_TAGS_MAX_COUNT
  ) {
    throw new MasterServiceInvalidTagsError(
      `Master service must have from ${MASTER_SERVICE_TAGS_MIN_COUNT} to ${MASTER_SERVICE_TAGS_MAX_COUNT} tags`,
      { count: normalized.length },
    );
  }

  const tooLong = normalized.find(
    (tag) => tag.length > MASTER_SERVICE_TAG_MAX_LENGTH,
  );
  if (tooLong) {
    throw new MasterServiceInvalidTagsError(
      `Each tag must be at most ${MASTER_SERVICE_TAG_MAX_LENGTH} characters`,
      { tag: tooLong, maxLength: MASTER_SERVICE_TAG_MAX_LENGTH },
    );
  }

  return normalized;
}
