import { Logger, NotFoundException } from '@nestjs/common';
import {
  GET_MANY_DEFAULT_PAGE,
  GET_MANY_DEFAULT_OFFSET,
} from 'src/constants';
import type { GetMasterServicesOutput } from 'src/modules/masters/application/dtos/master-service/get-master-services.output';
import type { IGetMasterServicesQueryPayload } from '../validation/schemas/get-master-services-query.types';

const logger = new Logger('GetMasterServicesResponseMapper');

export interface IGetMasterServicesHttpResponse {
  data: GetMasterServicesOutput['items'];
  meta: {
    total: number;
    totalCount: number;
    offset: number;
    limit: number;
    page: number;
  };
}

export function mapGetMasterServicesHttpResponse(
  output: GetMasterServicesOutput,
  payload: IGetMasterServicesQueryPayload,
): IGetMasterServicesHttpResponse {
  if (!output.items.length) {
    logger.warn('Master services list empty');
    throw new NotFoundException('Услуги мастеров не найдены');
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
