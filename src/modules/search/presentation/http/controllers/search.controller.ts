import { BadRequestException, Controller, Get } from '@nestjs/common';
import { SearchByTextUseCase } from 'src/modules/search/application/use-cases/search-by-text.use-case';
import { PublicEndpoint } from '@shared/presentation/decorators/public-endpoint.decorator';
import { HttpQuery } from '@shared/presentation/http/decorators';
import { requestQueryParamsToSearchByTextUseCaseInput } from '../request-mappers/request-query-params-to-search-by-text-use-case-input';
import { mapSearchHttpResponse } from '../http-responses/map-search-http-response';
import { getSearchQuerySchema } from '../validation/schemas/get-search-query.schema';
import type { IGetSearchQueryPayload } from '../validation/schemas/get-search-query.types';

@Controller({ path: 'search', version: '1' })
export class SearchController {
  constructor(private readonly searchByTextUseCase: SearchByTextUseCase) {}

  @Get()
  @PublicEndpoint()
  async search(
    @HttpQuery(getSearchQuerySchema, {
      errorMessage: 'Некорректные параметры поискового запроса',
    })
    payload: IGetSearchQueryPayload,
  ) {
    const hasQ = payload.q != null && payload.q.trim() !== '';
    const hasCategory = payload.category != null;
    const hasLocalityId = payload.localityId != null;

    if (!hasQ && !hasCategory && !hasLocalityId) {
      throw new BadRequestException(
        'Укажите поисковый запрос (q), категорию (category) и/или город (localityId)',
      );
    }

    const input = requestQueryParamsToSearchByTextUseCaseInput(payload);
    const output = await this.searchByTextUseCase.execute(input);
    return mapSearchHttpResponse(output);
  }
}
