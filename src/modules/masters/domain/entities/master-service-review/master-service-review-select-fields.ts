export const MASTER_SERVICE_REVIEW_SELECT_FIELDS = [
  'id',
  'clientUserId',
  'masterServiceId',
  'appointmentId',
  'rating',
  'text',
  'createdAt',
  'updatedAt',
  'deletedAt',
] as const;

export const MASTER_SERVICE_REVIEW_STAFF_ONLY_FIELDS = ['deletedAt'] as const;
