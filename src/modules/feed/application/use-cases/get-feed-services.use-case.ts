import { EAddressEntityType } from 'src/modules/geo/domain/entities/address';
import type { IAddressRepository } from 'src/modules/geo/domain/repositories/address';
import { EMasterBookingStatus } from 'src/modules/masters/domain/entities/master-profile';
import type {
  IMasterServicePublicEntity,
  IMasterServiceRelations,
} from 'src/modules/masters/domain/entities/master-service';
import type { IMasterProfileRepository } from 'src/modules/masters/domain/repositories/master-profile';
import type { IMasterServiceRepository } from 'src/modules/masters/domain/repositories/master-service';
import { presetToSelectOptions as masterServicePresetToSelectOptions } from 'src/modules/masters/presentation/http/request-mappers/master-service/preset-to-select-options.mapper';
import { splitPresetReadOptions } from 'src/modules/shared/application/presets/common/split-preset-read-options.helper';
import type { FindManyParams } from 'src/modules/shared/domain/query';
import { buildPaginatedListResponse } from 'src/modules/shared/presentation/http/http-responses/build-paginated-list-response';
import { mapPaginationToSlice } from 'src/modules/shared/presentation/http/query/map-pagination-to-slice';
import {
  FEED_CANDIDATE_LIMIT,
  buildUserInterestProfile,
  isColdStart,
  scoreFeedService,
} from '../../domain/entities/feed-ranking';
import type { IFeedInterestSignalsReader } from '../../domain/repositories/feed-interest-signals/i-feed-interest-signals.reader';
import type { IGetFeedServicesApplicationInput } from '../dtos/i-get-feed-services-input.dto';
import type { IGetFeedServicesApplicationOutput } from '../dtos/i-get-feed-services-output.dto';

function buildServiceSelectOptions() {
  const short = masterServicePresetToSelectOptions('SHORT', false);
  const base = masterServicePresetToSelectOptions('BASE', false);
  return splitPresetReadOptions({
    select: short.select,
    include: base.include,
  });
}

function buildDiscoverabilityWhere(
  masterProfileIds?: string[],
  excludeMasterProfileId?: string,
): Record<string, unknown> {
  const masterProfileFilter: Record<string, unknown> = {
    bookingStatus: EMasterBookingStatus.ACCEPTING,
    user: {
      emailVerifiedAt: { isNull: false },
    },
  };

  if (excludeMasterProfileId && masterProfileIds == null) {
    masterProfileFilter.id = { ne: excludeMasterProfileId };
  }

  return {
    deletedAt: { isNull: true },
    masterProfile: masterProfileFilter,
    ...(masterProfileIds ? { masterProfileId: { in: masterProfileIds } } : {}),
  };
}

export class GetFeedServicesUseCase {
  constructor(
    private readonly masterServiceRepository: IMasterServiceRepository,
    private readonly masterProfileRepository: IMasterProfileRepository,
    private readonly addressRepository: IAddressRepository,
    private readonly interestSignalsReader: IFeedInterestSignalsReader,
  ) {}

  async execute(
    input: IGetFeedServicesApplicationInput,
  ): Promise<IGetFeedServicesApplicationOutput> {
    const page = input.page;
    const limit = input.limit;
    const slice = mapPaginationToSlice({ page, limit });

    const ownProfile = await this.masterProfileRepository.findEntityByUserId(
      input.userId,
    );
    const excludeMasterProfileId = ownProfile?.id;

    let masterProfileIds: string[] | undefined;

    if (input.localityId) {
      masterProfileIds = await this.addressRepository.findEntityIdsByLocalityId(
        input.localityId,
        EAddressEntityType.MASTER_PROFILE,
      );
      if (masterProfileIds.length === 0) {
        const empty = buildPaginatedListResponse({
          items: [],
          totalCount: 0,
          page,
          limit,
        });
        return { items: [], total: 0, meta: empty.meta };
      }

      if (excludeMasterProfileId) {
        masterProfileIds = masterProfileIds.filter(
          (id) => id !== excludeMasterProfileId,
        );
        if (masterProfileIds.length === 0) {
          const empty = buildPaginatedListResponse({
            items: [],
            totalCount: 0,
            page,
            limit,
          });
          return { items: [], total: 0, meta: empty.meta };
        }
      }
    }

    const signals = await this.interestSignalsReader.loadSignals(input.userId);

    const profile = buildUserInterestProfile(signals);

    const where = buildDiscoverabilityWhere(
      masterProfileIds,
      excludeMasterProfileId,
    );

    const selectOptions = buildServiceSelectOptions();

    if (isColdStart(profile)) {
      const params: FindManyParams<
        IMasterServicePublicEntity,
        IMasterServiceRelations
      > = {
        where,
        slice,
        orderBy: [
          { field: 'rating', direction: 'desc' },
          { field: 'id', direction: 'asc' },
        ],
        ...selectOptions,
      };

      const [items, total] = await Promise.all([
        this.masterServiceRepository.findMany(params),
        this.masterServiceRepository.count({ where }),
      ]);

      const paginated = buildPaginatedListResponse({
        items,
        totalCount: total,
        page,
        limit,
      });

      return { items, total, meta: paginated.meta };
    }

    const candidateParams: FindManyParams<
      IMasterServicePublicEntity,
      IMasterServiceRelations
    > = {
      where,
      slice: { offset: 0, limit: FEED_CANDIDATE_LIMIT },
      orderBy: [
        { field: 'rating', direction: 'desc' },
        { field: 'id', direction: 'asc' },
      ],
      ...selectOptions,
    };

    const candidates =
      await this.masterServiceRepository.findMany(candidateParams);

    const filtered = candidates.filter(
      (service) => !profile.recentBookedServiceIds.has(service.id),
    );

    const ranked = filtered
      .map((service) => ({
        service,
        score: scoreFeedService(
          {
            id: service.id,
            category: service.category,
            tags: service.tags,
            rating: service.rating,
            masterProfileId: service.masterProfileId,
          },
          profile,
        ),
      }))
      .sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return b.service.rating - a.service.rating;
      });

    const total = ranked.length;
    const pageItems = ranked
      .slice(slice.offset, slice.offset + slice.limit)
      .map((entry) => entry.service);

    const paginated = buildPaginatedListResponse({
      items: pageItems,
      totalCount: total,
      page,
      limit,
    });

    return { items: pageItems, total, meta: paginated.meta };
  }
}
