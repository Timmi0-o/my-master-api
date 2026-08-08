import { SearchByTextUseCase } from 'src/modules/search/application/use-cases/search-by-text.use-case';
import type { IMasterProfileRepository } from 'src/modules/masters/domain/repositories/master-profile';
import type { IMasterServiceRepository } from 'src/modules/masters/domain/repositories/master-service';
import type { IAddressRepository } from 'src/modules/geo/domain/repositories/address';
import { EMasterBookingStatus } from 'src/modules/masters/domain/entities/master-profile';
import { MASTER_OWNER_EMAIL_VERIFIED_WHERE } from 'src/modules/masters/domain/entities/master-profile/filters/master-owner-email-verified.where';
import {
  EMasterServiceCategory,
  EMasterServiceStatus,
} from 'src/modules/masters/domain/entities/master-service';
import type { ISearchTaxonomyReader } from 'src/modules/search/domain/repositories/search-taxonomy';

describe('SearchByTextUseCase discovery filters', () => {
  const createUseCase = (taxonomyOverrides?: Partial<ISearchTaxonomyReader>) => {
    const masterProfileRepository = {
      findMany: jest.fn().mockResolvedValue([]),
    } as unknown as IMasterProfileRepository;

    const masterServiceRepository = {
      findMany: jest.fn().mockResolvedValue([]),
      count: jest.fn().mockResolvedValue(0),
    } as unknown as IMasterServiceRepository;

    const addressRepository = {
      findEntityIdsByLocalityId: jest.fn(),
    } as unknown as IAddressRepository;

    const searchTaxonomyReader: ISearchTaxonomyReader = {
      findExactMatch: jest.fn().mockResolvedValue(null),
      findFuzzyMatches: jest.fn().mockResolvedValue([]),
      findFuzzyServiceIdsByName: jest.fn().mockResolvedValue([]),
      ...taxonomyOverrides,
    };

    const useCase = new SearchByTextUseCase(
      masterProfileRepository,
      masterServiceRepository,
      addressRepository,
      searchTaxonomyReader,
    );

    return {
      useCase,
      masterProfileRepository,
      masterServiceRepository,
      addressRepository,
      searchTaxonomyReader,
    };
  };

  it('always gates by ACCEPTING and verified email', async () => {
    const { useCase, masterProfileRepository, masterServiceRepository } =
      createUseCase();

    await useCase.execute({ q: 'cut' });

    expect(masterProfileRepository.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          bookingStatus: EMasterBookingStatus.ACCEPTING,
          ...MASTER_OWNER_EMAIL_VERIFIED_WHERE,
          deletedAt: { isNull: true },
        }),
      }),
    );

    expect(masterServiceRepository.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          deletedAt: { isNull: true },
          status: EMasterServiceStatus.ACTIVE,
          masterProfile: expect.objectContaining({
            bookingStatus: EMasterBookingStatus.ACCEPTING,
          }),
        }),
      }),
    );
  });

  it('applies price and minRating filters to services', async () => {
    const { useCase, masterServiceRepository } = createUseCase();

    await useCase.execute({
      category: EMasterServiceCategory.BEAUTY,
      minPrice: 100,
      maxPrice: 500,
      minRating: 4,
      sort: 'price_asc',
    });

    expect(masterServiceRepository.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          status: EMasterServiceStatus.ACTIVE,
          category: EMasterServiceCategory.BEAUTY,
          price: { gte: 100, lte: 500 },
          rating: { gte: 4 },
        }),
        orderBy: [
          { field: 'price', direction: 'asc' },
          { field: 'id', direction: 'asc' },
        ],
      }),
    );
  });

  it('returns empty results when locality has no masters', async () => {
    const {
      useCase,
      addressRepository,
      masterProfileRepository,
      masterServiceRepository,
    } = createUseCase();

    ;(addressRepository.findEntityIdsByLocalityId as jest.Mock).mockResolvedValue(
      [],
    );

    const result = await useCase.execute({
      localityId: '11111111-1111-1111-1111-111111111111',
    });

    expect(result.masters).toEqual([]);
    expect(result.services).toEqual([]);
    expect(result.servicesMeta.totalCount).toBe(0);
    expect(masterProfileRepository.findMany).not.toHaveBeenCalled();
    expect(masterServiceRepository.findMany).not.toHaveBeenCalled();
  });

  it('orders services by rating for relevance sort', async () => {
    const { useCase, masterServiceRepository, masterProfileRepository } =
      createUseCase();

    await useCase.execute({ q: 'nail', sort: 'relevance' });

    expect(masterServiceRepository.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        orderBy: [
          { field: 'rating', direction: 'desc' },
          { field: 'id', direction: 'asc' },
        ],
      }),
    );
    expect(masterProfileRepository.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        orderBy: [
          { field: 'rating', direction: 'desc' },
          { field: 'id', direction: 'asc' },
        ],
      }),
    );
  });

  it('uses SHORT-like select for masters (no nested services dump)', async () => {
    const { useCase, masterProfileRepository } = createUseCase();

    await useCase.execute({ q: 'barber' });

    const call = (masterProfileRepository.findMany as jest.Mock).mock
      .calls[0][0];
    expect(call.selectOptions?.include?.services).toBeUndefined();
  });

  it('expands synonym query into canonical terms and hasSome tags', async () => {
    const { useCase, masterServiceRepository, searchTaxonomyReader } =
      createUseCase({
        findExactMatch: jest.fn().mockResolvedValue({
          canonical: 'маникюр',
          aliases: ['ноготочки', 'ногти', 'nails'],
        }),
      });

    await useCase.execute({ q: 'ноготочки' });

    expect(searchTaxonomyReader.findExactMatch).toHaveBeenCalledWith(
      'ноготочки',
    );

    const where = (masterServiceRepository.findMany as jest.Mock).mock
      .calls[0][0].where;

    expect(where.or).toEqual(
      expect.arrayContaining([
        { name: { containsInsensitive: 'маникюр' } },
        { description: { containsInsensitive: 'маникюр' } },
        { name: { containsInsensitive: 'ноготочки' } },
        {
          tags: {
            hasSome: expect.arrayContaining([
              'ноготочки',
              'маникюр',
              'ногти',
              'nails',
            ]),
          },
        },
      ]),
    );
  });

  it('falls back to contains on normalized query when taxonomy has no hits', async () => {
    const { useCase, masterServiceRepository, searchTaxonomyReader } =
      createUseCase();

    await useCase.execute({ q: 'unique-query' });

    expect(searchTaxonomyReader.findExactMatch).toHaveBeenCalledWith(
      'unique-query',
    );
    expect(searchTaxonomyReader.findFuzzyMatches).toHaveBeenCalled();

    const where = (masterServiceRepository.findMany as jest.Mock).mock
      .calls[0][0].where;

    expect(where.or).toEqual(
      expect.arrayContaining([
        { name: { containsInsensitive: 'unique-query' } },
        { description: { containsInsensitive: 'unique-query' } },
        { tags: { hasSome: ['unique-query'] } },
      ]),
    );
  });

  it('includes fuzzy service ids in the or clause', async () => {
    const fuzzyId = '22222222-2222-2222-2222-222222222222';
    const { useCase, masterServiceRepository } = createUseCase({
      findFuzzyServiceIdsByName: jest.fn().mockResolvedValue([fuzzyId]),
    });

    await useCase.execute({ q: 'маникюрр' });

    const where = (masterServiceRepository.findMany as jest.Mock).mock
      .calls[0][0].where;

    expect(where.or).toEqual(
      expect.arrayContaining([{ id: { in: [fuzzyId] } }]),
    );
  });
});
