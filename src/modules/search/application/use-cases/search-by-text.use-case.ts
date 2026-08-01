import { EAddressEntityType } from 'src/modules/geo/domain/entities/address';
import type { IAddressRepository } from 'src/modules/geo/domain/repositories/address';
import {
  EMasterBookingStatus,
  type IMasterProfilePublicEntity,
  type IMasterProfileRelations,
} from 'src/modules/masters/domain/entities/master-profile';
import { MASTER_OWNER_EMAIL_VERIFIED_WHERE } from 'src/modules/masters/domain/entities/master-profile/filters/master-owner-email-verified.where';
import type {
  IMasterServicePublicEntity,
  IMasterServiceRelations,
} from 'src/modules/masters/domain/entities/master-service';
import type { IMasterProfileRepository } from 'src/modules/masters/domain/repositories/master-profile';
import type { IMasterServiceRepository } from 'src/modules/masters/domain/repositories/master-service';
import { presetToSelectOptions as masterProfilePresetToSelectOptions } from 'src/modules/masters/presentation/http/request-mappers/master-profile/preset-to-select-options.mapper';
import { presetToSelectOptions as masterServicePresetToSelectOptions } from 'src/modules/masters/presentation/http/request-mappers/master-service/preset-to-select-options.mapper';
import { splitPresetReadOptions } from 'src/modules/shared/application/presets/common/split-preset-read-options.helper';
import type { FindManyParams, OrderBy } from 'src/modules/shared/domain/query';
import { buildPaginatedListResponse } from 'src/modules/shared/presentation/http/http-responses/build-paginated-list-response';
import { mapPaginationToSlice } from 'src/modules/shared/presentation/http/query/map-pagination-to-slice';
import type {
  ISearchByTextApplicationInput,
  ISearchByTextApplicationOutput,
  TSearchSort,
} from '../dtos/search-by-text.dto';

const DEFAULT_SEARCH_LIMIT = 20;
const DEFAULT_SEARCH_PAGE = 1;
const DEFAULT_SEARCH_SORT: TSearchSort = 'relevance';

function buildServiceTextSearchOr(q: string): Record<string, unknown>[] {
  return [
    { name: { containsInsensitive: q } },
    { description: { containsInsensitive: q } },
    { tags: { has: q.trim().toLowerCase() } },
  ];
}

function buildPriceWhere(
  minPrice?: number,
  maxPrice?: number,
): Record<string, unknown> | undefined {
  if (minPrice == null && maxPrice == null) {
    return undefined;
  }
  return {
    ...(minPrice != null ? { gte: minPrice } : {}),
    ...(maxPrice != null ? { lte: maxPrice } : {}),
  };
}

function buildServiceDiscoverabilityWhere(
  minPrice?: number,
  maxPrice?: number,
  category?: ISearchByTextApplicationInput['category'],
): Record<string, unknown> {
  const price = buildPriceWhere(minPrice, maxPrice);
  return {
    deletedAt: { isNull: true },
    ...(category != null ? { category } : {}),
    ...(price ? { price } : {}),
  };
}

function buildMasterWhere(
  input: Pick<
    ISearchByTextApplicationInput,
    'q' | 'category' | 'minPrice' | 'maxPrice' | 'minRating'
  >,
  masterProfileIds?: string[],
): Record<string, unknown> {
  const { q, category, minPrice, maxPrice, minRating } = input;
  const hasPriceFilter = minPrice != null || maxPrice != null;

  const base: Record<string, unknown> = {
    deletedAt: { isNull: true },
    bookingStatus: EMasterBookingStatus.ACCEPTING,
    ...MASTER_OWNER_EMAIL_VERIFIED_WHERE,
    ...(masterProfileIds ? { id: { in: masterProfileIds } } : {}),
    ...(minRating != null ? { rating: { gte: minRating } } : {}),
  };

  const serviceSomeBase = buildServiceDiscoverabilityWhere(
    minPrice,
    maxPrice,
    category,
  );

  if (!q && category == null && !hasPriceFilter) {
    return base;
  }

  if (!q) {
    return {
      ...base,
      services: {
        some: serviceSomeBase,
      },
    };
  }

  const serviceTextOr = buildServiceTextSearchOr(q);

  if (category == null && !hasPriceFilter) {
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
              some: serviceSomeBase,
            },
          },
        ],
      },
      {
        services: {
          some: {
            ...serviceSomeBase,
            or: serviceTextOr,
          },
        },
      },
    ],
  };
}

function buildServiceWhere(
  input: Pick<
    ISearchByTextApplicationInput,
    'q' | 'category' | 'minPrice' | 'maxPrice' | 'minRating'
  >,
  masterProfileIds?: string[],
): Record<string, unknown> {
  const { q, category, minPrice, maxPrice, minRating } = input;
  const price = buildPriceWhere(minPrice, maxPrice);
  const serviceTextOr = q ? buildServiceTextSearchOr(q) : undefined;

  return {
    deletedAt: { isNull: true },
    masterProfile: {
      bookingStatus: EMasterBookingStatus.ACCEPTING,
      user: {
        emailVerifiedAt: { isNull: false },
      },
    },
    ...(serviceTextOr ? { or: serviceTextOr } : {}),
    ...(category != null ? { category } : {}),
    ...(price ? { price } : {}),
    ...(minRating != null ? { rating: { gte: minRating } } : {}),
    ...(masterProfileIds ? { masterProfileId: { in: masterProfileIds } } : {}),
  };
}

function buildServiceOrderBy(
  sort: TSearchSort,
): OrderBy<IMasterServicePublicEntity, IMasterServiceRelations> {
  if (sort === 'price_asc') {
    return [
      { field: 'price', direction: 'asc' },
      { field: 'id', direction: 'asc' },
    ];
  }
  if (sort === 'price_desc') {
    return [
      { field: 'price', direction: 'desc' },
      { field: 'id', direction: 'asc' },
    ];
  }
  return [
    { field: 'rating', direction: 'desc' },
    { field: 'id', direction: 'asc' },
  ];
}

function buildMasterOrderBy(): OrderBy<
  IMasterProfilePublicEntity,
  IMasterProfileRelations
> {
  return [
    { field: 'rating', direction: 'desc' },
    { field: 'id', direction: 'asc' },
  ];
}

function buildServiceSelectOptions() {
  const short = masterServicePresetToSelectOptions('SHORT', false);
  const base = masterServicePresetToSelectOptions('BASE', false);
  return splitPresetReadOptions({
    select: short.select,
    include: base.include,
  });
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
    const minPrice = input.minPrice;
    const maxPrice = input.maxPrice;
    const minRating = input.minRating;
    const sort = input.sort ?? DEFAULT_SEARCH_SORT;
    const limit = input.limit ?? DEFAULT_SEARCH_LIMIT;
    const page = input.page ?? DEFAULT_SEARCH_PAGE;
    const slice = mapPaginationToSlice({ page, limit });

    let masterProfileIds: string[] | undefined;
    if (localityId) {
      masterProfileIds = await this.addressRepository.findEntityIdsByLocalityId(
        localityId,
        EAddressEntityType.MASTER_PROFILE,
      );
      if (masterProfileIds.length === 0) {
        const emptyMeta = buildPaginatedListResponse({
          items: [],
          totalCount: 0,
          page,
          limit,
        }).meta;
        return { masters: [], services: [], servicesMeta: emptyMeta };
      }
    }

    const filterInput = { q, category, minPrice, maxPrice, minRating };
    const masterWhere = buildMasterWhere(filterInput, masterProfileIds);
    const serviceWhere = buildServiceWhere(filterInput, masterProfileIds);

    const masterParams: FindManyParams<
      IMasterProfilePublicEntity,
      IMasterProfileRelations
    > = {
      where: masterWhere,
      slice,
      orderBy: buildMasterOrderBy(),
      ...splitPresetReadOptions(
        masterProfilePresetToSelectOptions('SHORT', false),
      ),
    };

    const serviceParams: FindManyParams<
      IMasterServicePublicEntity,
      IMasterServiceRelations
    > = {
      where: serviceWhere,
      slice,
      orderBy: buildServiceOrderBy(sort),
      ...buildServiceSelectOptions(),
    };

    const [masters, services, servicesTotalCount] = await Promise.all([
      this.masterProfileRepository.findMany(masterParams),
      this.masterServiceRepository.findMany(serviceParams),
      this.masterServiceRepository.count({ where: serviceWhere }),
    ]);

    const servicesMeta = buildPaginatedListResponse({
      items: services,
      totalCount: servicesTotalCount,
      page,
      limit,
    }).meta;

    return { masters, services, servicesMeta };
  }
}
