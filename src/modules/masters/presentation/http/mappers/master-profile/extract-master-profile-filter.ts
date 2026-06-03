import type { IMasterProfileFiltersPreset } from 'src/modules/masters/application/presets/master-profile-filters-preset.types';
import { MasterProfileFilterExtractor } from 'src/modules/masters/application/presets/master-profile.filter-extractor';
import { stripDeletedAtFilterForNonStaff } from 'src/modules/shared/application/presets/common/query-filter.helper';

export function extractMasterProfileFilter(
  filter: IMasterProfileFiltersPreset | undefined,
  isStaffUser: boolean,
): Record<string, unknown> {
  return MasterProfileFilterExtractor.extract(
    stripDeletedAtFilterForNonStaff(filter, isStaffUser),
  );
}
