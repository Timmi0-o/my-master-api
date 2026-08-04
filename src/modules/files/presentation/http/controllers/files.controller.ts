import { AuthenticatedUser } from '@modules/auth/presentation/decorators/authenticated-user.decorator';
import { JwtAuthGuard } from '@modules/auth/presentation/guards/jwt-auth.guard';
import { Permissions } from '@modules/authorization/domain/permissions/permission-names';
import { Authorize } from '@modules/authorization/presentation/decorators/authorize.decorator';
import { AuthorizeGuard } from '@modules/authorization/presentation/guards/authorize.guard';
import { GrantFileAccessUseCase } from '@modules/files/application/use-cases/file-access/grant-file-access.use-case';
import { RevokeFileAccessUseCase } from '@modules/files/application/use-cases/file-access/revoke-file-access.use-case';
import { CreateFileShareUseCase } from '@modules/files/application/use-cases/file-share/create-file-share.use-case';
import { RevokeFileShareUseCase } from '@modules/files/application/use-cases/file-share/revoke-file-share.use-case';
import { CreateFilesUseCase } from '@modules/files/application/use-cases/file/create-files.use-case';
import { DeleteFilesUseCase } from '@modules/files/application/use-cases/file/delete-files.use-case';
import { GetFileUseCase } from '@modules/files/application/use-cases/file/get-file.use-case';
import { GetFilesByIdsUseCase } from '@modules/files/application/use-cases/file/get-files-by-ids.use-case';
import { MoveFileUseCase } from '@modules/files/application/use-cases/file/move-file.use-case';
import { PresignedUploadUseCase } from '@modules/files/application/use-cases/file/presigned-upload.use-case';
import { QueryFilesUseCase } from '@modules/files/application/use-cases/file/query-files.use-case';
import { UpdateFileUseCase } from '@modules/files/application/use-cases/file/update-file.use-case';
import { isAllowedFileUrl } from '@modules/files/shared/constants/url-whitelist';
import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import type { IGetMetadata } from '@shared/domain/decorators/i-get-metadata';
import type { ISessionUser } from '@shared/domain/i-session-user';
import { RateLimiter } from '@shared/infrastructure/throttler/http-rate-limit.decorators';
import { GetMetadata } from '@shared/presentation/decorators/get-metadata';
import {
  HttpBody,
  HttpParams,
  HttpQuery,
} from '@shared/presentation/http/decorators';
import {
  normalizeIdParam,
  normalizeParams,
} from '@shared/presentation/http/helpers/normalize-id-param';
import { normalizeQueryFilesRaw } from '../helpers/normalize-query-files-raw';
import {
  mapCreateFileShareHttpResponse,
  mapCreateFilesHttpResponse,
  mapDeleteFilesHttpResponse,
  mapGetFileByIdHttpResponse,
  mapGetFilesByIdsHttpResponse,
  mapGrantFileAccessHttpResponse,
  mapMoveFileHttpResponse,
  mapPresignedUploadHttpResponse,
  mapQueryFilesHttpResponse,
  mapRevokeFileAccessHttpResponse,
  mapRevokeFileShareHttpResponse,
  mapUpdateFileHttpResponse,
} from '../http-responses/map-files-http-response';
import { requestBodyToGrantFileAccessUseCaseInput } from '../request-mappers/file-access/request-body-to-grant-file-access-use-case-input';
import { requestParamsToRevokeFileAccessUseCaseInput } from '../request-mappers/file-access/request-params-to-revoke-file-access-use-case-input';
import { requestBodyToCreateFileShareUseCaseInput } from '../request-mappers/file-share/request-body-to-create-file-share-use-case-input';
import { requestParamsToRevokeFileShareUseCaseInput } from '../request-mappers/file-share/request-params-to-revoke-file-share-use-case-input';
import { requestBodyToCreateFilesUseCaseInput } from '../request-mappers/file/request-body-to-create-files-use-case-input';
import { requestBodyToDeleteFilesUseCaseInput } from '../request-mappers/file/request-body-to-delete-files-use-case-input';
import { requestBodyToGetFilesByIdsUseCaseInput } from '../request-mappers/file/request-body-to-get-files-by-ids-use-case-input';
import { requestBodyToMoveFileUseCaseInput } from '../request-mappers/file/request-body-to-move-file-use-case-input';
import { requestBodyToPresignedUploadUseCaseInput } from '../request-mappers/file/request-body-to-presigned-upload-use-case-input';
import { requestBodyToUpdateFileUseCaseInput } from '../request-mappers/file/request-body-to-update-file-use-case-input';
import { requestQueryParamsToGetFileUseCaseInput } from '../request-mappers/file/request-query-params-to-get-file-use-case-input';
import { requestQueryParamsToQueryFilesUseCaseInput } from '../request-mappers/file/request-query-params-to-query-files-use-case-input';
import { createFileSharePayloadSchema } from '../validation/schemas/create-file-share-payload.schema';
import type { ICreateFileSharePayload } from '../validation/schemas/create-file-share-payload.types';
import type { ICreateFilesPayload } from '../validation/schemas/create-files-payload.schema';
import { createFilesPayloadSchema } from '../validation/schemas/create-files-payload.schema';
import { deleteFilesPayloadSchema } from '../validation/schemas/delete-files-payload.schema';
import type { IDeleteFilesPayload } from '../validation/schemas/delete-files-payload.types';
import type { IGetFilesByIdsPayload } from '../validation/schemas/get-files-by-ids-payload.schema';
import { getFilesByIdsPayloadSchema } from '../validation/schemas/get-files-by-ids-payload.schema';
import { grantFileAccessPayloadSchema } from '../validation/schemas/grant-file-access-payload.schema';
import type { IGrantFileAccessPayload } from '../validation/schemas/grant-file-access-payload.types';
import { idParamSchema } from '../validation/schemas/id-param.schema';
import type { IIdParamPayload } from '../validation/schemas/id-param.types';
import { moveFilePayloadSchema } from '../validation/schemas/move-file-payload.schema';
import type { IMoveFilePayload } from '../validation/schemas/move-file-payload.types';
import type { IPresignedUploadPayload } from '../validation/schemas/presigned-upload-payload.schema';
import { presignedUploadPayloadSchema } from '../validation/schemas/presigned-upload-payload.schema';
import { queryFilesQuerySchema } from '../validation/schemas/query-files-query.schema';
import type { IQueryFilesQueryPayload } from '../validation/schemas/query-files-query.types';
import { revokeFileAccessParamsSchema } from '../validation/schemas/revoke-file-access-params.schema';
import type { IRevokeFileAccessParamsPayload } from '../validation/schemas/revoke-file-access-params.types';
import { revokeFileShareParamsSchema } from '../validation/schemas/revoke-file-share-params.schema';
import type { IRevokeFileShareParamsPayload } from '../validation/schemas/revoke-file-share-params.types';
import { updateFilePayloadSchema } from '../validation/schemas/update-file-payload.schema';
import type { IUpdateFilePayload } from '../validation/schemas/update-file-payload.types';

@RateLimiter('mediaWrite')
@Controller({ path: 'files', version: '1' })
@UseGuards(JwtAuthGuard, AuthorizeGuard)
export class FilesController {
  constructor(
    private readonly presignedUploadUseCase: PresignedUploadUseCase,
    private readonly getFileUseCase: GetFileUseCase,
    private readonly getFilesByIdsUseCase: GetFilesByIdsUseCase,
    private readonly queryFilesUseCase: QueryFilesUseCase,
    private readonly createFilesUseCase: CreateFilesUseCase,
    private readonly updateFileUseCase: UpdateFileUseCase,
    private readonly moveFileUseCase: MoveFileUseCase,
    private readonly deleteFilesUseCase: DeleteFilesUseCase,
    private readonly grantFileAccessUseCase: GrantFileAccessUseCase,
    private readonly revokeFileAccessUseCase: RevokeFileAccessUseCase,
    private readonly createFileShareUseCase: CreateFileShareUseCase,
    private readonly revokeFileShareUseCase: RevokeFileShareUseCase,
  ) {}

  @Post('presign')
  @Authorize({ kind: 'permissions', permissions: [Permissions.files.create] })
  async presign(
    @HttpBody(presignedUploadPayloadSchema, {
      errorMessage: 'Некорректные данные для presigned upload',
    })
    payload: IPresignedUploadPayload,
    @AuthenticatedUser() user: ISessionUser,
    @GetMetadata() metadata: IGetMetadata,
  ) {
    const input = requestBodyToPresignedUploadUseCaseInput(
      payload,
      user,
      metadata,
    );
    const output = await this.presignedUploadUseCase.execute(input);
    return mapPresignedUploadHttpResponse(output);
  }

  @Get()
  @Authorize({ kind: 'permissions', permissions: [Permissions.files.read] })
  async queryFiles(
    @HttpQuery(queryFilesQuerySchema, {
      preprocess: normalizeQueryFilesRaw,
      errorMessage: 'Некорректные параметры запроса файлов',
    })
    payload: IQueryFilesQueryPayload,
    @AuthenticatedUser() user: ISessionUser,
    @GetMetadata() metadata: IGetMetadata,
  ) {
    const input = requestQueryParamsToQueryFilesUseCaseInput(
      payload,
      user,
      metadata,
    );
    const output = await this.queryFilesUseCase.execute(input);
    return mapQueryFilesHttpResponse(output);
  }

  @Post('batch')
  @Authorize({ kind: 'permissions', permissions: [Permissions.files.read] })
  async getByIds(
    @HttpBody(getFilesByIdsPayloadSchema, {
      errorMessage: 'Некорректные идентификаторы файлов',
    })
    payload: IGetFilesByIdsPayload,
    @AuthenticatedUser() user: ISessionUser,
    @GetMetadata() metadata: IGetMetadata,
  ) {
    const input = requestBodyToGetFilesByIdsUseCaseInput(
      payload,
      user,
      metadata,
    );
    const output = await this.getFilesByIdsUseCase.execute(input);
    return mapGetFilesByIdsHttpResponse(output);
  }

  @Post()
  @Authorize({ kind: 'permissions', permissions: [Permissions.files.create] })
  async createFiles(
    @HttpBody(createFilesPayloadSchema, {
      errorMessage: 'Некорректные данные для создания файлов',
    })
    payload: ICreateFilesPayload,
    @AuthenticatedUser() user: ISessionUser,
    @GetMetadata() metadata: IGetMetadata,
  ) {
    for (const file of payload.files) {
      if (!isAllowedFileUrl(file.fileUrl)) {
        throw new BadRequestException('URL файла не разрешён');
      }
    }

    const input = requestBodyToCreateFilesUseCaseInput(payload, user, metadata);
    const output = await this.createFilesUseCase.execute(input);
    return mapCreateFilesHttpResponse(output);
  }

  @Get(':id')
  @Authorize({ kind: 'permissions', permissions: [Permissions.files.read] })
  async getById(
    @HttpParams(idParamSchema, {
      preprocess: normalizeIdParam,
      errorMessage: 'Некорректный идентификатор',
    })
    params: IIdParamPayload,
    @AuthenticatedUser() user: ISessionUser,
    @GetMetadata() metadata: IGetMetadata,
  ) {
    const input = requestQueryParamsToGetFileUseCaseInput(
      params.id,
      {},
      user,
      metadata,
    );
    const output = await this.getFileUseCase.execute(input);
    return mapGetFileByIdHttpResponse(output);
  }

  @Patch(':id')
  @Authorize({ kind: 'permissions', permissions: [Permissions.files.update] })
  async update(
    @HttpParams(idParamSchema, {
      preprocess: normalizeIdParam,
      errorMessage: 'Некорректный идентификатор',
    })
    params: IIdParamPayload,
    @HttpBody(updateFilePayloadSchema, {
      errorMessage: 'Некорректные данные для обновления файла',
    })
    payload: IUpdateFilePayload,
    @AuthenticatedUser() user: ISessionUser,
    @GetMetadata() metadata: IGetMetadata,
  ) {
    const input = requestBodyToUpdateFileUseCaseInput(
      params.id,
      payload,
      user,
      metadata,
    );
    const output = await this.updateFileUseCase.execute(input);
    return mapUpdateFileHttpResponse(output);
  }

  @Post(':id/move')
  @Authorize({ kind: 'permissions', permissions: [Permissions.files.update] })
  async move(
    @HttpParams(idParamSchema, {
      preprocess: normalizeIdParam,
      errorMessage: 'Некорректный идентификатор',
    })
    params: IIdParamPayload,
    @HttpBody(moveFilePayloadSchema, {
      errorMessage: 'Некорректные данные для перемещения файла',
    })
    payload: IMoveFilePayload,
    @AuthenticatedUser() user: ISessionUser,
    @GetMetadata() metadata: IGetMetadata,
  ) {
    const input = requestBodyToMoveFileUseCaseInput(
      params.id,
      payload,
      user,
      metadata,
    );
    const output = await this.moveFileUseCase.execute(input);
    return mapMoveFileHttpResponse(output);
  }

  @Delete()
  @Authorize({ kind: 'permissions', permissions: [Permissions.files.delete] })
  async deleteMany(
    @HttpBody(deleteFilesPayloadSchema, {
      errorMessage: 'Некорректные идентификаторы для удаления',
    })
    payload: IDeleteFilesPayload,
    @AuthenticatedUser() user: ISessionUser,
    @GetMetadata() metadata: IGetMetadata,
  ) {
    const input = requestBodyToDeleteFilesUseCaseInput(payload, user, metadata);
    const output = await this.deleteFilesUseCase.execute(input);
    return mapDeleteFilesHttpResponse(output);
  }

  @Post(':id/access')
  @Authorize({ kind: 'permissions', permissions: [Permissions.files.update] })
  async grantAccess(
    @HttpParams(idParamSchema, {
      preprocess: normalizeIdParam,
      errorMessage: 'Некорректный идентификатор',
    })
    params: IIdParamPayload,
    @HttpBody(grantFileAccessPayloadSchema, {
      errorMessage: 'Некорректные данные для выдачи доступа',
    })
    payload: IGrantFileAccessPayload,
    @AuthenticatedUser() user: ISessionUser,
    @GetMetadata() metadata: IGetMetadata,
  ) {
    const input = requestBodyToGrantFileAccessUseCaseInput(
      params.id,
      payload,
      user,
      metadata,
    );
    const output = await this.grantFileAccessUseCase.execute(input);
    return mapGrantFileAccessHttpResponse(output);
  }

  @Delete(':id/access/:accessId')
  @Authorize({ kind: 'permissions', permissions: [Permissions.files.update] })
  async revokeAccess(
    @HttpParams(revokeFileAccessParamsSchema, {
      preprocess: (params) => normalizeParams(params, ['id', 'accessId']),
      errorMessage: 'Некорректные параметры отзыва доступа',
    })
    params: IRevokeFileAccessParamsPayload,
    @AuthenticatedUser() user: ISessionUser,
    @GetMetadata() metadata: IGetMetadata,
  ) {
    const input = requestParamsToRevokeFileAccessUseCaseInput(
      params.id,
      params.accessId,
      user,
      metadata,
    );
    await this.revokeFileAccessUseCase.execute(input);
    return mapRevokeFileAccessHttpResponse();
  }

  @Post(':id/shares')
  @Authorize({ kind: 'permissions', permissions: [Permissions.files.update] })
  async createShare(
    @HttpParams(idParamSchema, {
      preprocess: normalizeIdParam,
      errorMessage: 'Некорректный идентификатор',
    })
    params: IIdParamPayload,
    @HttpBody(createFileSharePayloadSchema, {
      errorMessage: 'Некорректные данные для создания share-ссылки',
    })
    payload: ICreateFileSharePayload,
    @AuthenticatedUser() user: ISessionUser,
    @GetMetadata() metadata: IGetMetadata,
  ) {
    const input = requestBodyToCreateFileShareUseCaseInput(
      params.id,
      payload,
      user,
      metadata,
    );
    const output = await this.createFileShareUseCase.execute(input);
    return mapCreateFileShareHttpResponse(output);
  }

  @Delete(':id/shares/:shareId')
  @Authorize({ kind: 'permissions', permissions: [Permissions.files.update] })
  async revokeShare(
    @HttpParams(revokeFileShareParamsSchema, {
      preprocess: (params) => normalizeParams(params, ['id', 'shareId']),
      errorMessage: 'Некорректные параметры отзыва share',
    })
    params: IRevokeFileShareParamsPayload,
    @AuthenticatedUser() user: ISessionUser,
    @GetMetadata() metadata: IGetMetadata,
  ) {
    const input = requestParamsToRevokeFileShareUseCaseInput(
      params.shareId,
      user,
      metadata,
    );
    await this.revokeFileShareUseCase.execute(input);
    return mapRevokeFileShareHttpResponse();
  }
}
