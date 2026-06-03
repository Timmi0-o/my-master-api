import { MasterServiceFilterExtractor } from 'src/modules/masters/application/presets/master-service.filter-extractor';
import type { IMasterServiceFiltersPreset } from 'src/modules/masters/application/presets/master-service-filters-preset.types';
import { stripDeletedAtFilterForNonStaff } from 'src/modules/shared/application/presets/common/query-filter.helper';

export function extractMasterServiceFilter(
  filter: IMasterServiceFiltersPreset | undefined,
  isStaffUser: boolean,
): Record<string, unknown> {
  return MasterServiceFilterExtractor.extract(
    stripDeletedAtFilterForNonStaff(filter, isStaffUser),
  );
}
