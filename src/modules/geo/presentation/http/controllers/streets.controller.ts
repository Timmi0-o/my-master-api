import { Controller, Get } from '@nestjs/common';
import { PublicEndpoint } from '@shared/presentation/decorators/public-endpoint.decorator';
import { HttpQuery } from '@shared/presentation/http/decorators';
import { GetStreetsUseCase } from 'src/modules/geo/application/use-cases/street/get-streets.use-case';
import { mapGetStreetsHttpResponse } from '../http-responses/map-get-streets-response';
import { requestQueryParamsToGetStreetsUseCaseInput } from '../request-mappers/street/request-query-params-to-get-streets-use-case-input';
import { getStreetsQuerySchema } from '../validation/schemas/get-streets-query.schema';
import type { IGetStreetsQueryPayload } from '../validation/schemas/get-streets-query.types';

@Controller({ path: 'geo/streets', version: '1' })
export class StreetsController {
  constructor(private readonly getStreetsUseCase: GetStreetsUseCase) {}

  @Get()
  @PublicEndpoint()
  async getStreets(
    @HttpQuery(getStreetsQuerySchema, {
      errorMessage: 'Некорректные параметры запроса улиц',
    })
    payload: IGetStreetsQueryPayload,
  ) {
    const input = requestQueryParamsToGetStreetsUseCaseInput(payload);
    const output = await this.getStreetsUseCase.execute(input);
    return mapGetStreetsHttpResponse(output);
  }
}
