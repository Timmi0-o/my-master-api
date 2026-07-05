import {
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthenticatedUser } from '@modules/auth/presentation/decorators/authenticated-user.decorator';
import { JwtAuthGuard } from '@modules/auth/presentation/guards/jwt-auth.guard';
import { Permissions } from '@modules/authorization/domain/permissions/permission-names';
import { Authorize } from '@modules/authorization/presentation/decorators/authorize.decorator';
import { AuthorizeGuard } from '@modules/authorization/presentation/guards/authorize.guard';
import { CreateFolderUseCase } from '@modules/files/application/use-cases/folder/create-folder.use-case';
import { DeleteFolderUseCase } from '@modules/files/application/use-cases/folder/delete-folder.use-case';
import { GetFolderUseCase } from '@modules/files/application/use-cases/folder/get-folder.use-case';
import { MoveFolderUseCase } from '@modules/files/application/use-cases/folder/move-folder.use-case';
import { UpdateFolderUseCase } from '@modules/files/application/use-cases/folder/update-folder.use-case';
import type { IGetMetadata } from '@shared/domain/decorators/i-get-metadata';
import type { ISessionUser } from '@shared/domain/i-session-user';
import { GetMetadata } from '@shared/presentation/decorators/get-metadata';
import { HttpBody, HttpParams, HttpQuery } from '@shared/presentation/http/decorators';
import { normalizeIdParam } from '@shared/presentation/http/helpers/normalize-id-param';
import { normalizeGetFolderQueryRaw } from '../helpers/normalize-get-folder-query-raw';
import { payloadToCreateFolderInput } from '../mappers/folder/payload-to-create-folder-input';
import { payloadToDeleteFolderInput } from '../mappers/folder/payload-to-delete-folder-input';
import { payloadToGetFolderInput } from '../mappers/folder/payload-to-get-folder-input';
import { payloadToMoveFolderInput } from '../mappers/folder/payload-to-move-folder-input';
import { payloadToUpdateFolderInput } from '../mappers/folder/payload-to-update-folder-input';
import {
  mapCreateFolderHttpResponse,
  mapDeleteFolderHttpResponse,
  mapGetFolderHttpResponse,
  mapMoveFolderHttpResponse,
  mapUpdateFolderHttpResponse,
} from '../response/map-folder-response';
import {
  createFolderPayloadSchema,
  moveFolderPayloadSchema,
  updateFolderPayloadSchema,
} from '../validation/schemas/folder-payload.schema';
import type { ICreateFolderPayload } from '../validation/schemas/create-folder-payload.types';
import type { IMoveFolderPayload } from '../validation/schemas/move-folder-payload.types';
import type { IUpdateFolderPayload } from '../validation/schemas/update-folder-payload.types';
import { getFolderQuerySchema } from '../validation/schemas/get-folder-query.schema';
import type { IGetFolderQueryPayload } from '../validation/schemas/get-folder-query.types';
import { idParamSchema } from '../validation/schemas/id-param.schema';
import type { IIdParamPayload } from '../validation/schemas/id-param.types';

@Controller({ path: 'folders', version: '1' })
@UseGuards(JwtAuthGuard, AuthorizeGuard)
export class FoldersController {
  constructor(
    private readonly getFolderUseCase: GetFolderUseCase,
    private readonly createFolderUseCase: CreateFolderUseCase,
    private readonly updateFolderUseCase: UpdateFolderUseCase,
    private readonly moveFolderUseCase: MoveFolderUseCase,
    private readonly deleteFolderUseCase: DeleteFolderUseCase,
  ) {}

  @Get()
  @Authorize({ kind: 'permissions', permissions: [Permissions.folders.read] })
  async getFolder(
    @HttpQuery(getFolderQuerySchema, {
      preprocess: normalizeGetFolderQueryRaw,
      errorMessage: 'Некорректные параметры запроса папки',
    })
    payload: IGetFolderQueryPayload,
    @AuthenticatedUser() user: ISessionUser,
    @GetMetadata() metadata: IGetMetadata,
  ) {
    const input = payloadToGetFolderInput(payload, user, metadata);
    const output = await this.getFolderUseCase.execute(input);
    return mapGetFolderHttpResponse(output);
  }

  @Post()
  @Authorize({ kind: 'permissions', permissions: [Permissions.folders.create] })
  async createFolder(
    @HttpBody(createFolderPayloadSchema, {
      errorMessage: 'Некорректные данные для создания папки',
    })
    payload: ICreateFolderPayload,
    @AuthenticatedUser() user: ISessionUser,
    @GetMetadata() metadata: IGetMetadata,
  ) {
    const input = payloadToCreateFolderInput(payload, user, metadata);
    const output = await this.createFolderUseCase.execute(input);
    return mapCreateFolderHttpResponse(output);
  }

  @Patch(':id')
  @Authorize({ kind: 'permissions', permissions: [Permissions.folders.update] })
  async updateFolder(
    @HttpParams(idParamSchema, {
      preprocess: normalizeIdParam,
      errorMessage: 'Некорректный идентификатор папки',
    })
    params: IIdParamPayload,
    @HttpBody(updateFolderPayloadSchema, {
      errorMessage: 'Некорректные данные для обновления папки',
    })
    payload: IUpdateFolderPayload,
    @AuthenticatedUser() user: ISessionUser,
    @GetMetadata() metadata: IGetMetadata,
  ) {
    const input = payloadToUpdateFolderInput(params.id, payload, user, metadata);
    const output = await this.updateFolderUseCase.execute(input);
    return mapUpdateFolderHttpResponse(output);
  }

  @Post(':id/move')
  @Authorize({ kind: 'permissions', permissions: [Permissions.folders.update] })
  async moveFolder(
    @HttpParams(idParamSchema, {
      preprocess: normalizeIdParam,
      errorMessage: 'Некорректный идентификатор папки',
    })
    params: IIdParamPayload,
    @HttpBody(moveFolderPayloadSchema, {
      errorMessage: 'Некорректные данные для перемещения папки',
    })
    payload: IMoveFolderPayload,
    @AuthenticatedUser() user: ISessionUser,
    @GetMetadata() metadata: IGetMetadata,
  ) {
    const input = payloadToMoveFolderInput(params.id, payload, user, metadata);
    const output = await this.moveFolderUseCase.execute(input);
    return mapMoveFolderHttpResponse(output);
  }

  @Delete(':id')
  @Authorize({ kind: 'permissions', permissions: [Permissions.folders.delete] })
  async deleteFolder(
    @HttpParams(idParamSchema, {
      preprocess: normalizeIdParam,
      errorMessage: 'Некорректный идентификатор папки',
    })
    params: IIdParamPayload,
    @AuthenticatedUser() user: ISessionUser,
    @GetMetadata() metadata: IGetMetadata,
  ) {
    const input = payloadToDeleteFolderInput(params.id, user, metadata);
    const output = await this.deleteFolderUseCase.execute(input);
    return mapDeleteFolderHttpResponse(output);
  }
}
