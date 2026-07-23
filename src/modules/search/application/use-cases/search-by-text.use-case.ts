import type { IMasterProfilePublicEntity } from 'src/modules/masters/domain/entities/master-profile';
import type { IMasterProfileRepository } from 'src/modules/masters/domain/repositories/master-profile';
import type { IMasterServicePublicEntity } from 'src/modules/masters/domain/entities/master-service';
import type { IMasterServiceRepository } from 'src/modules/masters/domain/repositories/master-service';
import { mapSearchByFields } from 'src/modules/shared/presentation/http/mappers/filter/map-search-by-fields';
import { mapPaginationToSlice } from 'src/modules/shared/presentation/http/query/map-pagination-to-slice';
import { presetToSelectOptions as masterProfilePresetToSelectOptions } from 'src/modules/masters/presentation/http/mappers/master-profile/preset-to-select-options.mapper';
import { presetToSelectOptions as masterServicePresetToSelectOptions } from 'src/modules/masters/presentation/http/mappers/master-service/preset-to-select-options.mapper';
import type {
  ISearchByTextApplicationInput,
  ISearchByTextApplicationOutput,
} from '../dtos/search-by-text.dto';

const DEFAULT_SEARCH_LIMIT = 20;

export class SearchByTextUseCase {
  constructor(
    private readonly masterProfileRepository: IMasterProfileRepository,
    private readonly masterServiceRepository: IMasterServiceRepository,
  ) {}

  async execute(
    input: ISearchByTextApplicationInput,
  ): Promise<ISearchByTextApplicationOutput> {
    const q = input.q?.trim() || undefined;
    const category = input.category;
    const limit = input.limit ?? DEFAULT_SEARCH_LIMIT;
    const slice = mapPaginationToSlice({ page: 1, limit });

    const masterSearchWhere = q
      ? mapSearchByFields<IMasterProfilePublicEntity>(
          q,
          ['displayName', 'description'],
          'PARTIAL',
        )
      : undefined;
    const serviceSearchWhere = q
      ? mapSearchByFields<IMasterServicePublicEntity>(
          q,
          ['name', 'description'],
          'PARTIAL',
        )
      : undefined;

    const masterWhere: Record<string, unknown> = {
      deletedAt: { isNull: true },
      ...(masterSearchWhere ?? {}),
      ...(category != null
        ? {
            services: {
              some: {
                category,
                deletedAt: { isNull: true },
              },
            },
          }
        : {}),
    };

    const serviceWhere: Record<string, unknown> = {
      deletedAt: { isNull: true },
      ...(serviceSearchWhere ?? {}),
      ...(category != null ? { category } : {}),
    };

    const [masters, services] = await Promise.all([
      this.masterProfileRepository.findMany({
        where: masterWhere,
        slice,
        selectOptions: masterProfilePresetToSelectOptions('BASE', false),
      }),
      this.masterServiceRepository.findMany({
        where: serviceWhere,
        slice,
        selectOptions: masterServicePresetToSelectOptions('BASE', false),
      }),
    ]);

    return { masters, services };
  }
}
