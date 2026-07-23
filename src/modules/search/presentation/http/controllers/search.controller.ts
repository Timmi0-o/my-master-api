import { BadRequestException, Controller, Get } from '@nestjs/common';
import { SearchByTextUseCase } from 'src/modules/search/application/use-cases/search-by-text.use-case';
import { PublicEndpoint } from '@shared/presentation/decorators/public-endpoint.decorator';
import { HttpQuery } from '@shared/presentation/http/decorators';
import { payloadToSearchByTextInput } from '../mappers/payload-to-search-by-text-input';
import { mapSearchHttpResponse } from '../response/map-search-http-response';
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

    if (!hasQ && !hasCategory) {
      throw new BadRequestException(
        'Укажите поисковый запрос (q) и/или категорию (category)',
      );
    }

    const input = payloadToSearchByTextInput(payload);
    const output = await this.searchByTextUseCase.execute(input);
    return mapSearchHttpResponse(output);
  }
}
