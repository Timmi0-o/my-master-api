import { Controller, Get, Param, Query, Req } from '@nestjs/common';
import type { Request } from 'express';
import { GetFileShareUseCase } from '../../../application/use-cases/file-share/get-file-share.use-case';
import { payloadToGetFileShareInput } from '../mappers/file-share/payload-to-get-file-share-input';
import { mapFileToHttpResponse } from '../response/map-file-response';

@Controller({ path: 'files/shares', version: '1' })
export class FileSharesController {
  constructor(private readonly getFileShareUseCase: GetFileShareUseCase) {}

  @Get(':token')
  async getByToken(
    @Param('token') token: string,
    @Query('password') password: string | undefined,
    @Req() req: Request,
  ) {
    const clientIp =
      (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
      req.ip;
    const input = payloadToGetFileShareInput(token, {
      password,
      clientIp,
    });
    const result = await this.getFileShareUseCase.execute(input);
    return {
      data: {
        share: result.share,
        file: mapFileToHttpResponse(result.file),
      },
    };
  }
}
