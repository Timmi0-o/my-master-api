import { Logger, NotFoundException } from '@nestjs/common';
import {
  GET_MANY_DEFAULT_LIMIT,
  GET_MANY_DEFAULT_OFFSET,
  GET_MANY_DEFAULT_PAGE,
  GET_MANY_MAX_LIMIT,
} from '../../../../constants';
import type { IListQueryParams } from '../../domain/list-query.params';

export interface IPrepareGetManyQueryParams<TOrderBy, TSelect = string> {
  payload: { limit?: number; page?: number; orderBy?: TOrderBy };
  isStaffUser: boolean;
  presetSelect?: TSelect[];
}

export interface IBuildGetManyResponseParams<TData> {
  data: TData[] | null;
  totalCount: number;
  limit: number;
  offset: number;
  page?: number;
  emptyErrorMessage: string;
  emptyLogMessage: string;
}

export interface IPrepareGetManyQueryResult<TOrderBy, TSelect = string> {
  limit: number;
  offset: number;
  orderBy: TOrderBy;
  select: TSelect[] | undefined;
}

export interface IPaginationMeta {
  total: number;
  totalCount: number;
  offset: number;
  limit: number;
}

export interface IGetManyPaginationMeta extends IPaginationMeta {
  page?: number;
}

export interface IBuildGetManyResponseResult<TData> {
  data: TData[];
  meta: IGetManyPaginationMeta;
}

export type IFindManyAndCountParams = IListQueryParams;

export interface IFindManyAndCountRepo {
  findMany(options?: Record<string, unknown>): Promise<unknown[] | null>;
  findManyWithRequiredIds(
    params: Record<string, unknown>,
    options?: Record<string, unknown>,
  ): Promise<unknown[] | null>;
  count(where?: Record<string, unknown>): Promise<number>;
}

export class GetManyHelper {
  private static readonly logger = new Logger(GetManyHelper.name);
  private static readonly DEFAULT_ORDER_BY: Record<string, 'asc' | 'desc'> = {
    id: 'asc',
  };

  public static prepareFindManyParams<TOrderBy, TSelect = string>(
    params: IPrepareGetManyQueryParams<TOrderBy, TSelect> & {
      where?: Record<string, unknown>;
      requiredIds?: string[];
      include?: Record<string, unknown>;
    },
  ): IFindManyAndCountParams {
    const query = this.prepareQuery(params);
    return {
      where: params.where,
      requiredIds: params.requiredIds,
      limit: query.limit,
      offset: query.offset,
      orderBy: query.orderBy as Record<string, 'asc' | 'desc'>,
      select: query.select as string[] | undefined,
      include: params.include,
    };
  }

  public static prepareQuery<TOrderBy, TSelect = string>(
    params: IPrepareGetManyQueryParams<TOrderBy, TSelect>,
  ): IPrepareGetManyQueryResult<TOrderBy, TSelect> {
    const limit = Math.min(
      params.payload.limit ?? GET_MANY_DEFAULT_LIMIT,
      GET_MANY_MAX_LIMIT,
    );
    const offset =
      params.payload.page != null
        ? (params.payload.page - GET_MANY_DEFAULT_PAGE) * limit
        : GET_MANY_DEFAULT_OFFSET;

    const orderBy = (
      params.payload.orderBy && Object.keys(params.payload.orderBy).length > 0
        ? params.payload.orderBy
        : this.DEFAULT_ORDER_BY
    ) as TOrderBy;

    return { limit, offset, orderBy, select: params.presetSelect };
  }

  public static async findManyAndCount<TData = unknown>(
    repo: IFindManyAndCountRepo,
    params: IFindManyAndCountParams,
  ): Promise<[TData[] | null, number]> {
    const [data, totalCount] = await Promise.all([
      params.requiredIds?.length
        ? repo.findManyWithRequiredIds(
            {
              where: params.where ?? {},
              requiredIds: params.requiredIds,
              limit: params.limit,
              offset: params.offset,
            },
            {
              orderBy: params.orderBy,
              select: params.select,
              ...(params.include && { include: params.include }),
            },
          )
        : repo.findMany({
            where: params.where,
            orderBy: params.orderBy,
            select: params.select,
            ...(params.include && { include: params.include }),
            take: params.limit,
            skip: params.offset,
          }),
      repo.count(params.where),
    ]);
    return [data as TData[] | null, totalCount];
  }

  public static buildResponse<TData>(
    params: IBuildGetManyResponseParams<TData>,
  ): IBuildGetManyResponseResult<TData> {
    if (!params.data) {
      this.logger.warn(params.emptyLogMessage);
      throw new NotFoundException(params.emptyErrorMessage);
    }

    const page =
      params.page ??
      (params.offset > GET_MANY_DEFAULT_OFFSET
        ? Math.floor(params.offset / params.limit) + GET_MANY_DEFAULT_PAGE
        : GET_MANY_DEFAULT_PAGE);

    const meta: IGetManyPaginationMeta = {
      total: params.data.length,
      totalCount: params.totalCount,
      offset: params.offset,
      limit: params.limit,
      page,
    };

    return { data: params.data, meta };
  }
}
