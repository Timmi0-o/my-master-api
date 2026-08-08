import type { IUpdateMasterServiceInput } from '../i-update-master-service.input';

/** Content fields that can harm the community → re-moderation on change. */
export const MASTER_SERVICE_MODERATION_CONTENT_FIELDS = [
  'name',
  'description',
  'tags',
] as const satisfies readonly (keyof IUpdateMasterServiceInput)[];
