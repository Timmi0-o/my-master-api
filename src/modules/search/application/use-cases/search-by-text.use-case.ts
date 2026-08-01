import {
  MASTER_OWNER_EMAIL_VERIFIED_WHERE,
  MASTER_SERVICE_OWNER_EMAIL_VERIFIED_WHERE,
} from 'src/modules/masters/domain/entities/master-profile/filters/master-owner-email-verified.where';
import type { IMasterProfileRepository } from 'src/modules/masters/domain/repositories/master-profile';
import type { IMasterServiceRepository } from 'src/modules/masters/domain/repositories/master-service';
import { EAddressEntityType } from 'src/modules/geo/domain/entities/address';
import type { IAddressRepository } from 'src/modules/geo/domain/repositories/address';
import { presetToSelectOptions as masterProfilePresetToSelectOptions } from 'src/modules/masters/presentation/http/request-mappers/master-profile/preset-to-select-options.mapper';
import { presetToSelectOptions as masterServicePresetToSelectOptions } from 'src/modules/masters/presentation/http/request-mappers/master-service/preset-to-select-options.mapper';
import { splitPresetReadOptions } from 'src/modules/shared/application/presets/common/split-preset-read-options.helper';
import { mapPaginationToSlice } from 'src/modules/shared/presentation/http/query/map-pagination-to-slice';
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
  masterProfileIds?: string[],
): Record<string, unknown> {
  const base: Record<string, unknown> = {
    deletedAt: { isNull: true },
    ...MASTER_OWNER_EMAIL_VERIFIED_WHERE,
    ...(masterProfileIds ? { id: { in: masterProfileIds } } : {}),
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
    private readonly addressRepository: IAddressRepository,
  ) {}

  async execute(
    input: ISearchByTextApplicationInput,
  ): Promise<ISearchByTextApplicationOutput> {
    const q = input.q?.trim() || undefined;
    const category = input.category;
    const localityId = input.localityId;
    const limit = input.limit ?? DEFAULT_SEARCH_LIMIT;
    const slice = mapPaginationToSlice({ page: 1, limit });

    let masterProfileIds: string[] | undefined;
    if (localityId) {
      masterProfileIds =
        await this.addressRepository.findEntityIdsByLocalityId(
          localityId,
          EAddressEntityType.MASTER_PROFILE,
        );
      if (masterProfileIds.length === 0) {
        return { masters: [], services: [] };
      }
    }

    const serviceTextOr = q ? buildServiceTextSearchOr(q) : undefined;

    const serviceWhere: Record<string, unknown> = {
      deletedAt: { isNull: true },
      ...MASTER_SERVICE_OWNER_EMAIL_VERIFIED_WHERE,
      ...(serviceTextOr ? { or: serviceTextOr } : {}),
      ...(category != null ? { category } : {}),
      ...(masterProfileIds
        ? { masterProfileId: { in: masterProfileIds } }
        : {}),
    };

    const [masters, services] = await Promise.all([
      this.masterProfileRepository.findMany({
        where: buildMasterWhere(q, category, masterProfileIds),
        slice,
        ...splitPresetReadOptions(
          masterProfilePresetToSelectOptions('BASE', false),
        ),
      }),
      this.masterServiceRepository.findMany({
        where: serviceWhere,
        slice,
        ...splitPresetReadOptions(
          masterServicePresetToSelectOptions('BASE', false),
        ),
      }),
    ]);

    return { masters, services };
  }
}
