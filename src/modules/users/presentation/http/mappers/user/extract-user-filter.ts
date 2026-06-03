import { stripDeletedAtFilterForNonStaff } from 'src/modules/shared/application/presets/common/query-filter.helper';
import type { IUserFiltersPreset } from 'src/modules/users/application/presets/user-filters-preset.types';
import { UserFilterExtractor } from 'src/modules/users/application/presets/user.filter-extractor';

export function extractUserFilter(
  filter: IUserFiltersPreset | undefined,
  isStaffUser: boolean,
): Record<string, unknown> {
  return UserFilterExtractor.extract(
    stripDeletedAtFilterForNonStaff(filter, isStaffUser),
  );
}
