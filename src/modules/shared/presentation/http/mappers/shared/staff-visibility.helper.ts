const FIELDS_DISALLOWED_FOR_NON_STAFF = ['deletedAt'] as const;

export function stripDeletedAtFilterForNonStaff<
  T extends { deletedAt?: unknown },
>(filter: T | undefined, isStaffUser: boolean): T | undefined {
  if (!filter || isStaffUser || filter.deletedAt === undefined) {
    return filter;
  }

  const { deletedAt: _deletedAt, ...rest } = filter;
  return Object.keys(rest).length > 0 ? (rest as T) : undefined;
}

export function omitDisallowedSelectFieldsForNonStaff(
  presetSelect: readonly string[] | undefined,
  isStaffUser: boolean,
): readonly string[] | undefined {
  if (presetSelect == null) {
    return undefined;
  }

  if (isStaffUser) {
    return presetSelect;
  }

  const disallowed = new Set<string>(FIELDS_DISALLOWED_FOR_NON_STAFF);
  return presetSelect.filter((field) => !disallowed.has(field));
}
