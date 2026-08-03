import { SearchByTextUseCase } from 'src/modules/search/application/use-cases/search-by-text.use-case';
import type { IMasterProfileRepository } from 'src/modules/masters/domain/repositories/master-profile';
import type { IMasterServiceRepository } from 'src/modules/masters/domain/repositories/master-service';
import type { IAddressRepository } from 'src/modules/geo/domain/repositories/address';
import { EMasterBookingStatus } from 'src/modules/masters/domain/entities/master-profile';
import { MASTER_OWNER_EMAIL_VERIFIED_WHERE } from 'src/modules/masters/domain/entities/master-profile/filters/master-owner-email-verified.where';
import { EMasterServiceCategory } from 'src/modules/masters/domain/entities/master-service';

describe('SearchByTextUseCase discovery filters', () => {
  const createUseCase = () => {
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

    const useCase = new SearchByTextUseCase(
      masterProfileRepository,
      masterServiceRepository,
      addressRepository,
    );

    return {
      useCase,
      masterProfileRepository,
      masterServiceRepository,
      addressRepository,
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
});
