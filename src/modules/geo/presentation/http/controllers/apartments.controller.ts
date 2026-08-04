import { Controller, Get } from '@nestjs/common';
import { RateLimiter } from '@shared/infrastructure/throttler/http-rate-limit.decorators';
import { PublicEndpoint } from '@shared/presentation/decorators/public-endpoint.decorator';
import { HttpQuery } from '@shared/presentation/http/decorators';
import { GetApartmentsUseCase } from 'src/modules/geo/application/use-cases/apartment/get-apartments.use-case';
import { mapGetApartmentsHttpResponse } from '../http-responses/map-get-apartments-response';
import { requestQueryParamsToGetApartmentsUseCaseInput } from '../request-mappers/apartment/request-query-params-to-get-apartments-use-case-input';
import { getApartmentsQuerySchema } from '../validation/schemas/get-apartments-query.schema';
import type { IGetApartmentsQueryPayload } from '../validation/schemas/get-apartments-query.types';

@RateLimiter('publicRead')
@Controller({ path: 'geo/apartments', version: '1' })
export class ApartmentsController {
  constructor(private readonly getApartmentsUseCase: GetApartmentsUseCase) {}

  @Get()
  @PublicEndpoint()
  async getApartments(
    @HttpQuery(getApartmentsQuerySchema, {
      errorMessage: 'Некорректные параметры запроса квартир',
    })
    payload: IGetApartmentsQueryPayload,
  ) {
    const input = requestQueryParamsToGetApartmentsUseCaseInput(payload);
    const output = await this.getApartmentsUseCase.execute(input);
    return mapGetApartmentsHttpResponse(output);
  }
}
