import { Controller, Get, Req } from '@nestjs/common';
import { GetFileShareUseCase } from '@modules/files/application/use-cases/file-share/get-file-share.use-case';
import { PublicEndpoint } from '@shared/presentation/decorators/public-endpoint.decorator';
import { HttpParams, HttpQuery } from '@shared/presentation/http/decorators';
import { normalizeParams } from '@shared/presentation/http/helpers/normalize-id-param';
import type { Request } from 'express';
import { payloadToGetFileShareInput } from '../mappers/file-share/payload-to-get-file-share-input';
import { mapGetFileShareByTokenHttpResponse } from '../response/map-files-http-response';
import { fileShareTokenParamSchema } from '../validation/schemas/file-share-token-param.schema';
import type { IFileShareTokenParamPayload } from '../validation/schemas/file-share-token-param.types';
import { getFileShareQuerySchema } from '../validation/schemas/get-file-share-query.schema';
import type { IGetFileShareHttpQueryPayload } from '../validation/schemas/get-file-share-query.types';

@Controller({ path: 'files/shares', version: '1' })
export class FileSharesController {
  constructor(private readonly getFileShareUseCase: GetFileShareUseCase) {}

  @Get(':token')
  @PublicEndpoint()
  async getByToken(
    @HttpParams(fileShareTokenParamSchema, {
      preprocess: (params) => normalizeParams(params, ['token']),
      errorMessage: 'Некорректный токен share-ссылки',
    })
    params: IFileShareTokenParamPayload,
    @HttpQuery(getFileShareQuerySchema, {
      errorMessage: 'Некорректные параметры запроса share-ссылки',
    })
    query: IGetFileShareHttpQueryPayload,
    @Req() req: Request,
  ) {
    const clientIp =
      (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
      req.ip;

    const input = payloadToGetFileShareInput(params.token, {
      ...query,
      clientIp,
    });
    const output = await this.getFileShareUseCase.execute(input);
    return mapGetFileShareByTokenHttpResponse(output);
  }
}
