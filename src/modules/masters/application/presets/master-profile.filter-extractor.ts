import { FilterPresetMapperCommon } from 'src/modules/shared/application/presets/common/filter-preset.mapper';
import type { IMasterProfileFiltersPreset } from './master-profile-filters-preset.types';

export class MasterProfileFilterExtractor {
  static extract(
    preset?: IMasterProfileFiltersPreset,
  ): Record<string, unknown> {
    if (!preset) return {};

    const parts: Record<string, unknown>[] = [];

    if (preset.search?.value) {
      const f = FilterPresetMapperCommon.mapSearchByFields(
        preset.search.value,
        ['displayName', 'description'],
        preset.search.mode ?? 'PARTIAL',
      );
      if (Object.keys(f).length > 0) parts.push(f);
    }

    if (preset.id?.value?.length) {
      const f = FilterPresetMapperCommon.mapStringArrayFilter('id', preset.id);
      if (Object.keys(f).length > 0) parts.push(f);
    }

    if (preset.userId?.value?.length) {
      const f = FilterPresetMapperCommon.mapStringArrayFilter(
        'userId',
        preset.userId,
      );
      if (Object.keys(f).length > 0) parts.push(f);
    }

    if (preset.displayName?.value?.length) {
      const f = FilterPresetMapperCommon.mapStringArrayFilter(
        'displayName',
        preset.displayName,
      );
      if (Object.keys(f).length > 0) parts.push(f);
    }

    if (preset.rating?.value?.length) {
      const f = FilterPresetMapperCommon.buildMultiNumberRangeFilter(
        'rating',
        preset.rating,
      );
      if (Object.keys(f).length > 0) parts.push(f);
    }

    if (preset.createdAt?.value?.length) {
      const f = FilterPresetMapperCommon.buildMultiDateRangeFilter(
        'createdAt',
        preset.createdAt,
      );
      if (Object.keys(f).length > 0) parts.push(f);
    }

    if (preset.updatedAt?.value?.length) {
      const f = FilterPresetMapperCommon.buildMultiDateRangeFilter(
        'updatedAt',
        preset.updatedAt,
      );
      if (Object.keys(f).length > 0) parts.push(f);
    }

    if (preset.deletedAt?.value?.length) {
      const f = FilterPresetMapperCommon.buildMultiDateRangeFilter(
        'deletedAt',
        preset.deletedAt,
      );
      if (Object.keys(f).length > 0) parts.push(f);
    }

    if (parts.length === 0) return {};
    if (parts.length === 1) return parts[0];
    return { AND: parts };
  }
}
