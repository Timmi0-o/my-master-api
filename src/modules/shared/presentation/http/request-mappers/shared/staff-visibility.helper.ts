export function stripStaffOnlyFilterFieldsForNonStaff<T extends object>(
  filter: T | undefined,
  isStaffUser: boolean,
  staffOnlyFields: readonly string[],
): T | undefined {
  if (!filter || isStaffUser || staffOnlyFields.length === 0) {
    return filter;
  }

  const entries = Object.entries(filter);
  const hasStaffOnlyKey = staffOnlyFields.some((field) =>
    entries.some(([key, value]) => key === field && value !== undefined),
  );
  if (!hasStaffOnlyKey) {
    return filter;
  }

  const staffOnly = new Set(staffOnlyFields);
  const rest = Object.fromEntries(
    entries.filter(([key]) => !staffOnly.has(key)),
  );

  return Object.keys(rest).length > 0 ? (rest as T) : undefined;
}

export function omitDisallowedSelectFieldsForNonStaff(
  presetSelect: readonly string[] | undefined,
  isStaffUser: boolean,
  staffOnlyFields: readonly string[],
): readonly string[] | undefined {
  if (presetSelect == null) {
    return undefined;
  }

  if (isStaffUser || staffOnlyFields.length === 0) {
    return presetSelect;
  }

  const disallowed = new Set<string>(staffOnlyFields);
  return presetSelect.filter((field) => !disallowed.has(field));
}
