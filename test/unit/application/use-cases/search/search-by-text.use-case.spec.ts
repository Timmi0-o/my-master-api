import { SearchByTextUseCase } from 'src/modules/search/application/use-cases/search-by-text.use-case';
import type { IMasterProfileRepository } from 'src/modules/masters/domain/repositories/master-profile';
import type { IMasterServiceRepository } from 'src/modules/masters/domain/repositories/master-service';
import {
  MASTER_OWNER_EMAIL_VERIFIED_WHERE,
  MASTER_SERVICE_OWNER_EMAIL_VERIFIED_WHERE,
} from 'src/modules/masters/domain/entities/master-profile/filters/master-owner-email-verified.where';

describe('SearchByTextUseCase', () => {
  it('filters masters and services by verified owner email', async () => {
    const masterProfileRepository = {
      findMany: jest.fn().mockResolvedValue([]),
    } as unknown as IMasterProfileRepository;
    const masterServiceRepository = {
      findMany: jest.fn().mockResolvedValue([]),
    } as unknown as IMasterServiceRepository;

    const useCase = new SearchByTextUseCase(
      masterProfileRepository,
      masterServiceRepository,
    );

    await useCase.execute({ q: 'cut' });

    expect(masterProfileRepository.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          ...MASTER_OWNER_EMAIL_VERIFIED_WHERE,
          deletedAt: { isNull: true },
        }),
      }),
    );
    expect(masterServiceRepository.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          ...MASTER_SERVICE_OWNER_EMAIL_VERIFIED_WHERE,
          deletedAt: { isNull: true },
        }),
      }),
    );
  });
});
