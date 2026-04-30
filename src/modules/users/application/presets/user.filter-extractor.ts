import { FilterPresetMapperCommon } from 'src/modules/shared/application/presets/common/filter-preset.mapper';

import type { IUserFiltersPreset } from './user-filters-preset.types';

export class UserFilterExtractor {
  static extract(preset?: IUserFiltersPreset): Record<string, unknown> {
    if (!preset) return {};

    const parts: Record<string, unknown>[] = [];

    if (preset.search?.value) {
      const f = FilterPresetMapperCommon.mapSearchByFields(
        preset.search.value,
        ['email', 'username'],
        preset.search.mode ?? 'PARTIAL',
      );
      if (Object.keys(f).length > 0) parts.push(f);
    }

    if (preset.id?.value?.length) {
      const f = FilterPresetMapperCommon.mapStringArrayFilter('id', preset.id);
      if (Object.keys(f).length > 0) parts.push(f);
    }

    if (preset.email?.value?.length) {
      const f = FilterPresetMapperCommon.mapStringArrayFilter(
        'email',
        preset.email,
      );
      if (Object.keys(f).length > 0) parts.push(f);
    }

    if (preset.username?.value?.length) {
      const f = FilterPresetMapperCommon.mapStringArrayFilter(
        'username',
        preset.username,
      );
      if (Object.keys(f).length > 0) parts.push(f);
    }

    if (preset.role?.value?.length) {
      const f = FilterPresetMapperCommon.mapStringArrayFilter(
        'role',
        preset.role,
      );
      if (Object.keys(f).length > 0) parts.push(f);
    }

    if (preset.status?.value?.length) {
      const f = FilterPresetMapperCommon.mapStringArrayFilter(
        'status',
        preset.status,
      );
      if (Object.keys(f).length > 0) parts.push(f);
    }

    if (preset.language?.value?.length) {
      const f = FilterPresetMapperCommon.mapStringArrayFilter(
        'language',
        preset.language,
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
