import { Controller, Get } from '@nestjs/common';
import { RateLimiter } from '@shared/infrastructure/throttler/http-rate-limit.decorators';
import { PublicEndpoint } from '@shared/presentation/decorators/public-endpoint.decorator';
import { HttpParams } from '@shared/presentation/http/decorators';
import { normalizeIdParam } from '@shared/presentation/http/helpers/normalize-id-param';
import { GetMasterAddressUseCase } from 'src/modules/masters/application/use-cases/master-profile/get-master-address.use-case';
import { mapGetMasterAddressHttpResponse } from '../http-responses/map-get-master-address-response';
import { idParamSchema } from '../validation/schemas/id-param.schema';
import type { IIdParamPayload } from '../validation/schemas/id-param.types';

@RateLimiter('publicRead')
@Controller({ path: 'master-profiles', version: '1' })
export class PublicMasterProfileAddressController {
  constructor(
    private readonly getMasterAddressUseCase: GetMasterAddressUseCase,
  ) {}

  @Get(':id/address')
  @PublicEndpoint()
  async getByMasterProfileId(
    @HttpParams(idParamSchema, {
      preprocess: normalizeIdParam,
      errorMessage: 'Некорректный идентификатор профиля мастера',
    })
    params: IIdParamPayload,
  ) {
    const address = await this.getMasterAddressUseCase.execute(params.id);
    return mapGetMasterAddressHttpResponse(address);
  }
}
