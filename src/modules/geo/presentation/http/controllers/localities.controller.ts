import { Controller, Get } from '@nestjs/common';
import { RateLimiter } from '@shared/infrastructure/throttler/http-rate-limit.decorators';
import { PublicEndpoint } from '@shared/presentation/decorators/public-endpoint.decorator';
import { HttpParams, HttpQuery } from '@shared/presentation/http/decorators';
import { GetLocalitiesUseCase } from 'src/modules/geo/application/use-cases/locality/get-localities.use-case';
import { GetLocalityBySlugOrIdUseCase } from 'src/modules/geo/application/use-cases/locality/get-locality-by-slug-or-id.use-case';
import { mapGetLocalitiesHttpResponse } from '../http-responses/map-get-localities-response';
import { mapGetLocalityBySlugOrIdHttpResponse } from '../http-responses/map-get-locality-by-slug-or-id-response';
import { requestParamsToGetLocalityBySlugOrIdUseCaseInput } from '../request-mappers/locality/request-params-to-get-locality-by-slug-or-id-use-case-input';
import { requestQueryParamsToGetLocalitiesUseCaseInput } from '../request-mappers/locality/request-query-params-to-get-localities-use-case-input';
import { getLocalitiesQuerySchema } from '../validation/schemas/get-localities-query.schema';
import type { IGetLocalitiesQueryPayload } from '../validation/schemas/get-localities-query.types';
import { slugOrIdParamSchema } from '../validation/schemas/slug-or-id-param.schema';
import type { ISlugOrIdParamPayload } from '../validation/schemas/slug-or-id-param.types';

@RateLimiter('publicRead')
@Controller({ path: 'geo/localities', version: '1' })
export class LocalitiesController {
  constructor(
    private readonly getLocalitiesUseCase: GetLocalitiesUseCase,
    private readonly getLocalityBySlugOrIdUseCase: GetLocalityBySlugOrIdUseCase,
  ) {}

  @Get()
  @PublicEndpoint()
  async getLocalities(
    @HttpQuery(getLocalitiesQuerySchema, {
      errorMessage: 'Некорректные параметры запроса населённых пунктов',
    })
    payload: IGetLocalitiesQueryPayload,
  ) {
    const input = requestQueryParamsToGetLocalitiesUseCaseInput(payload);
    const output = await this.getLocalitiesUseCase.execute(input);
    return mapGetLocalitiesHttpResponse(output);
  }

  @Get(':slugOrId')
  @PublicEndpoint()
  async getLocality(
    @HttpParams(slugOrIdParamSchema, {
      errorMessage: 'Некорректный идентификатор населённого пункта',
    })
    params: ISlugOrIdParamPayload,
  ) {
    const input = requestParamsToGetLocalityBySlugOrIdUseCaseInput(params);
    const output = await this.getLocalityBySlugOrIdUseCase.execute(input);
    return mapGetLocalityBySlugOrIdHttpResponse(output);
  }
}
