export function toDbWhere(
  where: Record<string, unknown>,
): Record<string, unknown> | undefined {
  return Object.keys(where).length > 0 ? where : undefined;
}

const SELECT_FIELDS_DISALLOWED_FOR_NON_STAFF = ['deletedAt'] as const;

export function omitDisallowedSelectFieldsForNonStaff(
  presetSelect: string[] | undefined,
  isStaffUser: boolean,
): string[] | undefined {
  if (presetSelect == null) {
    return undefined;
  }

  if (isStaffUser) {
    return presetSelect;
  }

  const disallowed = new Set<string>(SELECT_FIELDS_DISALLOWED_FOR_NON_STAFF);
  return presetSelect.filter((field) => !disallowed.has(field));
}
