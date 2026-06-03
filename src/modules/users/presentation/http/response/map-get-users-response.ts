import { Logger, NotFoundException } from '@nestjs/common';
import {
  GET_MANY_DEFAULT_PAGE,
  GET_MANY_DEFAULT_OFFSET,
} from 'src/constants';
import type { GetUsersOutput } from 'src/modules/users/application/dtos/user/get-users.output';
import type { IGetUsersQueryPayload } from '../validation/schemas/get-users-query.types';

const logger = new Logger('GetUsersResponseMapper');

export interface IGetUsersHttpResponse {
  data: GetUsersOutput['items'];
  meta: {
    total: number;
    totalCount: number;
    offset: number;
    limit: number;
    page: number;
  };
}

export function mapGetUsersHttpResponse(
  output: GetUsersOutput,
  payload: IGetUsersQueryPayload,
): IGetUsersHttpResponse {
  if (!output.items.length) {
    logger.warn('Users list empty');
    throw new NotFoundException('Пользователи не найдены');
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
