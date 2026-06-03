import { FilterPresetMapperCommon } from 'src/modules/shared/application/presets/common/filter-preset.mapper';
import type { IMasterServiceFiltersPreset } from './master-service-filters-preset.types';

export class MasterServiceFilterExtractor {
  static extract(preset?: IMasterServiceFiltersPreset): Record<string, unknown> {
    if (!preset) return {};

    const parts: Record<string, unknown>[] = [];

    if (preset.search?.value) {
      const f = FilterPresetMapperCommon.mapSearchByFields(
        preset.search.value,
        ['name', 'description'],
        preset.search.mode ?? 'PARTIAL',
      );
      if (Object.keys(f).length > 0) parts.push(f);
    }

    if (preset.id?.value?.length) {
      const f = FilterPresetMapperCommon.mapStringArrayFilter('id', preset.id);
      if (Object.keys(f).length > 0) parts.push(f);
    }

    if (preset.masterProfileId?.value?.length) {
      const f = FilterPresetMapperCommon.mapStringArrayFilter(
        'masterProfileId',
        preset.masterProfileId,
      );
      if (Object.keys(f).length > 0) parts.push(f);
    }

    if (preset.name?.value?.length) {
      const f = FilterPresetMapperCommon.mapStringArrayFilter('name', preset.name);
      if (Object.keys(f).length > 0) parts.push(f);
    }

    if (preset.price?.value?.length) {
      const f = FilterPresetMapperCommon.buildMultiNumberRangeFilter(
        'price',
        preset.price,
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
