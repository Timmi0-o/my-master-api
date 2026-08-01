import { BadRequestException } from '@nestjs/common';
import { SearchController } from 'src/modules/search/presentation/http/controllers/search.controller';
import type { SearchByTextUseCase } from 'src/modules/search/application/use-cases/search-by-text.use-case';

describe('SearchController discovery validation', () => {
  const createController = () => {
    const searchByTextUseCase = {
      execute: jest.fn().mockResolvedValue({
        masters: [],
        services: [],
        servicesMeta: {
          total: 0,
          totalCount: 0,
          offset: 0,
          limit: 20,
          page: 1,
        },
      }),
    } as unknown as SearchByTextUseCase;

    return {
      controller: new SearchController(searchByTextUseCase),
      searchByTextUseCase,
    };
  };

  it('rejects minPrice greater than maxPrice', async () => {
    const { controller, searchByTextUseCase } = createController();

    await expect(
      controller.search({
        minPrice: 500,
        maxPrice: 100,
      }),
    ).rejects.toBeInstanceOf(BadRequestException);

    expect(searchByTextUseCase.execute).not.toHaveBeenCalled();
  });

  it('allows request with only price filters', async () => {
    const { controller, searchByTextUseCase } = createController();

    await controller.search({
      minPrice: 100,
      maxPrice: 500,
    });

    expect(searchByTextUseCase.execute).toHaveBeenCalled();
  });

  it('rejects empty search without criteria', async () => {
    const { controller, searchByTextUseCase } = createController();

    await expect(controller.search({})).rejects.toBeInstanceOf(
      BadRequestException,
    );

    expect(searchByTextUseCase.execute).not.toHaveBeenCalled();
  });
});
