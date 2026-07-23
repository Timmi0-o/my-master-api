import type { IMasterProfileRepository } from 'src/modules/masters/domain/repositories/master-profile';
import type { IMasterServiceRepository } from 'src/modules/masters/domain/repositories/master-service';
import { mapPaginationToSlice } from 'src/modules/shared/presentation/http/query/map-pagination-to-slice';
import { presetToSelectOptions as masterProfilePresetToSelectOptions } from 'src/modules/masters/presentation/http/mappers/master-profile/preset-to-select-options.mapper';
import { presetToSelectOptions as masterServicePresetToSelectOptions } from 'src/modules/masters/presentation/http/mappers/master-service/preset-to-select-options.mapper';
import type {
  ISearchByTextApplicationInput,
  ISearchByTextApplicationOutput,
} from '../dtos/search-by-text.dto';

const DEFAULT_SEARCH_LIMIT = 20;

function buildServiceTextSearchOr(q: string): Record<string, unknown>[] {
  return [
    { name: { containsInsensitive: q } },
    { description: { containsInsensitive: q } },
    { tags: { has: q.trim().toLowerCase() } },
  ];
}

function buildMasterWhere(
  q: string | undefined,
  category: ISearchByTextApplicationInput['category'],
): Record<string, unknown> {
  const base: Record<string, unknown> = {
    deletedAt: { isNull: true },
  };

  if (!q && category == null) {
    return base;
  }

  if (!q && category != null) {
    return {
      ...base,
      services: {
        some: {
          category,
          deletedAt: { isNull: true },
        },
      },
    };
  }

  const serviceTextOr = buildServiceTextSearchOr(q!);

  if (category == null) {
    return {
      ...base,
      or: [
        { displayName: { containsInsensitive: q } },
        { description: { containsInsensitive: q } },
        {
          services: {
            some: {
              deletedAt: { isNull: true },
              or: serviceTextOr,
            },
          },
        },
      ],
    };
  }

  return {
    ...base,
    or: [
      {
        and: [
          {
            or: [
              { displayName: { containsInsensitive: q } },
              { description: { containsInsensitive: q } },
            ],
          },
          {
            services: {
              some: {
                category,
                deletedAt: { isNull: true },
              },
            },
          },
        ],
      },
      {
        services: {
          some: {
            category,
            deletedAt: { isNull: true },
            or: serviceTextOr,
          },
        },
      },
    ],
  };
}

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

    const serviceTextOr = q ? buildServiceTextSearchOr(q) : undefined;

    const serviceWhere: Record<string, unknown> = {
      deletedAt: { isNull: true },
      ...(serviceTextOr ? { or: serviceTextOr } : {}),
      ...(category != null ? { category } : {}),
    };

    const [masters, services] = await Promise.all([
      this.masterProfileRepository.findMany({
        where: buildMasterWhere(q, category),
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
