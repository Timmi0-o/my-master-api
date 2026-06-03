import { Logger, NotFoundException } from '@nestjs/common';
import {
  GET_MANY_DEFAULT_PAGE,
  GET_MANY_DEFAULT_OFFSET,
} from 'src/constants';
import type { GetMasterProfilesOutput } from 'src/modules/masters/application/dtos/master-profile/get-master-profiles.output';
import type { IGetMasterProfilesQueryPayload } from '../validation/schemas/get-master-profiles-query.types';

const logger = new Logger('GetMasterProfilesResponseMapper');

export interface IGetMasterProfilesHttpResponse {
  data: GetMasterProfilesOutput['items'];
  meta: {
    total: number;
    totalCount: number;
    offset: number;
    limit: number;
    page: number;
  };
}

export function mapGetMasterProfilesHttpResponse(
  output: GetMasterProfilesOutput,
  payload: IGetMasterProfilesQueryPayload,
): IGetMasterProfilesHttpResponse {
  if (!output.items.length) {
    logger.warn('Master profiles list empty');
    throw new NotFoundException('Профили мастеров не найдены');
  }

  const limit = payload.limit ?? 20;
  const page = payload.page ?? GET_MANY_DEFAULT_PAGE;
  const offset =
    page > GET_MANY_DEFAULT_PAGE
      ? (page - GET_MANY_DEFAULT_PAGE) * limit
      : GET_MANY_DEFAULT_OFFSET;

  return {
    data: output.items,
    meta: {
      total: output.items.length,
      totalCount: output.total,
      offset,
      limit,
      page,
    },
  };
}
