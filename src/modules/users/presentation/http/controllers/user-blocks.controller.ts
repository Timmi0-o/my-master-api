import { AuthenticatedUser } from '@modules/auth/presentation/decorators/authenticated-user.decorator';
import { JwtAuthGuard } from '@modules/auth/presentation/guards/jwt-auth.guard';
import { Authorize } from '@modules/authorization/presentation/decorators/authorize.decorator';
import { AuthorizeGuard } from '@modules/authorization/presentation/guards/authorize.guard';
import { CreateUserBlockUseCase } from '@modules/users/application/use-cases/user-block/create-user-block.use-case';
import { DeleteUserBlockByIdUseCase } from '@modules/users/application/use-cases/user-block/delete-user-block-by-id.use-case';
import { GetUserBlockByIdUseCase } from '@modules/users/application/use-cases/user-block/get-user-block-by-id.use-case';
import { GetUserBlocksUseCase } from '@modules/users/application/use-cases/user-block/get-user-blocks.use-case';
import { createUserBlockPayloadSchema } from '@modules/users/presentation/http/validation/schemas/create-user-block-payload.schema';
import type { ICreateUserBlockPayload } from '@modules/users/presentation/http/validation/schemas/create-user-block-payload.types';
import { getByIdQuerySchema } from '@modules/users/presentation/http/validation/schemas/get-by-id-query.schema';
import type { IGetByIdQueryPayload } from '@modules/users/presentation/http/validation/schemas/get-by-id-query.types';
import { getUserBlocksQuerySchema } from '@modules/users/presentation/http/validation/schemas/get-user-blocks-query.schema';
import type { IGetUserBlocksQueryPayload } from '@modules/users/presentation/http/validation/schemas/get-user-blocks-query.types';
import { idParamSchema } from '@modules/users/presentation/http/validation/schemas/id-param.schema';
import type { IIdParamPayload } from '@modules/users/presentation/http/validation/schemas/id-param.types';
import { Controller, Delete, Get, Post, UseGuards } from '@nestjs/common';
import type { IGetMetadata } from '@shared/domain/decorators/i-get-metadata';
import type { ISessionUser } from '@shared/domain/i-session-user';
import { RateLimiter } from '@shared/infrastructure/throttler/http-rate-limit.decorators';
import { GetMetadata } from '@shared/presentation/decorators/get-metadata';
import {
  HttpBody,
  HttpParams,
  HttpQuery,
} from '@shared/presentation/http/decorators';
import { normalizeIdParam } from '@shared/presentation/http/helpers/normalize-id-param';
import { normalizeListQueryRaw } from '@shared/presentation/http/helpers/normalize-list-query-raw';
import { mapCreateUserBlockHttpResponse } from '../http-responses/map-create-user-block-response';
import { mapDeleteUserBlockHttpResponse } from '../http-responses/map-delete-user-block-response';
import { mapGetUserBlockByIdHttpResponse } from '../http-responses/map-get-user-block-by-id-response';
import { mapGetUserBlocksHttpResponse } from '../http-responses/map-get-user-blocks-response';
import { requestBodyToCreateUserBlockUseCaseInput } from '../request-mappers/user-block/request-body-to-create-user-block-use-case-input';
import { requestParamsToDeleteUserBlockUseCaseInput } from '../request-mappers/user-block/request-params-to-delete-user-block-use-case-input';
import { requestQueryParamsToFindManyParams } from '../request-mappers/user-block/request-query-params-to-find-many-params.mapper';
import { requestQueryParamsToGetUserBlockByIdUseCaseInput } from '../request-mappers/user-block/request-query-params-to-get-user-block-by-id-use-case-input';

@RateLimiter('standard')
@Controller({ path: 'user-blocks', version: '1' })
@UseGuards(JwtAuthGuard, AuthorizeGuard)
@Authorize({ kind: 'authenticated' })
export class UserBlocksController {
  constructor(
    private readonly getUserBlocksUseCase: GetUserBlocksUseCase,
    private readonly getUserBlockByIdUseCase: GetUserBlockByIdUseCase,
    private readonly createUserBlockUseCase: CreateUserBlockUseCase,
    private readonly deleteUserBlockByIdUseCase: DeleteUserBlockByIdUseCase,
  ) {}

  @Get()
  async getUserBlocks(
    @HttpQuery(getUserBlocksQuerySchema, {
      preprocess: normalizeListQueryRaw,
      errorMessage: 'Некорректные параметры запроса списка блокировок',
    })
    queryParams: IGetUserBlocksQueryPayload,
    @AuthenticatedUser() user: ISessionUser,
    @GetMetadata() metadata: IGetMetadata,
  ) {
    const params = requestQueryParamsToFindManyParams(
      queryParams,
      metadata,
      user.id,
    );
    const output = await this.getUserBlocksUseCase.execute(params);
    return mapGetUserBlocksHttpResponse(output, queryParams);
  }

  @Get(':id')
  async getUserBlockById(
    @HttpParams(idParamSchema, {
      preprocess: normalizeIdParam,
      errorMessage: 'Некорректный идентификатор',
    })
    params: IIdParamPayload,
    @HttpQuery(getByIdQuerySchema, {
      errorMessage: 'Некорректные параметры запроса',
    })
    queryPayload: IGetByIdQueryPayload,
    @AuthenticatedUser() user: ISessionUser,
    @GetMetadata() metadata: IGetMetadata,
  ) {
    const input = requestQueryParamsToGetUserBlockByIdUseCaseInput(
      params.id,
      queryPayload,
      metadata.isStaffUser,
      user.id,
    );
    const item = await this.getUserBlockByIdUseCase.execute(input);
    return mapGetUserBlockByIdHttpResponse(item);
  }

  @Post()
  async createUserBlock(
    @HttpBody(createUserBlockPayloadSchema, {
      errorMessage: 'Некорректный payload блокировки пользователя',
    })
    payload: ICreateUserBlockPayload,
    @AuthenticatedUser() user: ISessionUser,
    @GetMetadata() metadata: IGetMetadata,
  ) {
    const input = requestBodyToCreateUserBlockUseCaseInput(
      payload,
      user,
      metadata.isStaffUser,
    );
    const output = await this.createUserBlockUseCase.execute(input);
    return mapCreateUserBlockHttpResponse(output);
  }

  @Delete(':id')
  async deleteUserBlock(
    @HttpParams(idParamSchema, {
      preprocess: normalizeIdParam,
      errorMessage: 'Некорректный идентификатор',
    })
    params: IIdParamPayload,
    @AuthenticatedUser() user: ISessionUser,
    @GetMetadata() metadata: IGetMetadata,
  ) {
    const input = requestParamsToDeleteUserBlockUseCaseInput(
      params.id,
      user,
      metadata.isStaffUser,
    );
    await this.deleteUserBlockByIdUseCase.execute(input);
    return mapDeleteUserBlockHttpResponse();
  }
}
