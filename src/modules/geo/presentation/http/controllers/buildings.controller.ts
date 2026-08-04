import { Controller, Get } from '@nestjs/common';
import { RateLimiter } from '@shared/infrastructure/throttler/http-rate-limit.decorators';
import { PublicEndpoint } from '@shared/presentation/decorators/public-endpoint.decorator';
import { HttpQuery } from '@shared/presentation/http/decorators';
import { GetBuildingsUseCase } from 'src/modules/geo/application/use-cases/building/get-buildings.use-case';
import { mapGetBuildingsHttpResponse } from '../http-responses/map-get-buildings-response';
import { requestQueryParamsToGetBuildingsUseCaseInput } from '../request-mappers/building/request-query-params-to-get-buildings-use-case-input';
import { getBuildingsQuerySchema } from '../validation/schemas/get-buildings-query.schema';
import type { IGetBuildingsQueryPayload } from '../validation/schemas/get-buildings-query.types';

@RateLimiter('publicRead')
@Controller({ path: 'geo/buildings', version: '1' })
export class BuildingsController {
  constructor(private readonly getBuildingsUseCase: GetBuildingsUseCase) {}

  @Get()
  @PublicEndpoint()
  async getBuildings(
    @HttpQuery(getBuildingsQuerySchema, {
      errorMessage: 'Некорректные параметры запроса зданий',
    })
    payload: IGetBuildingsQueryPayload,
  ) {
    const input = requestQueryParamsToGetBuildingsUseCaseInput(payload);
    const output = await this.getBuildingsUseCase.execute(input);
    return mapGetBuildingsHttpResponse(output);
  }
}
