import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import type { IGetMetadata } from '@shared/domain/decorators/i-get-metadata';
import type { ISessionUser } from '@shared/domain/i-session-user';
import { GetMetadata } from '@shared/presentation/decorators/get-metadata';
import { AuthenticatedUser } from 'src/modules/auth/presentation/decorators/authenticated-user.decorator';
import { JwtAuthGuard } from 'src/modules/auth/presentation/guards/jwt-auth.guard';
import { GetFolderUseCase } from '../../../application/use-cases/folder/get-folder.use-case';
import { CreateFolderUseCase } from '../../../application/use-cases/folder/create-folder.use-case';
import { UpdateFolderUseCase } from '../../../application/use-cases/folder/update-folder.use-case';
import { MoveFolderUseCase } from '../../../application/use-cases/folder/move-folder.use-case';
import { DeleteFolderUseCase } from '../../../application/use-cases/folder/delete-folder.use-case';
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
import { FoldersValidator } from '../validation/folders.validator';

@Controller({ path: 'folders', version: '1' })
@UseGuards(JwtAuthGuard)
export class FoldersController {
  constructor(
    private readonly getFolderUseCase: GetFolderUseCase,
    private readonly createFolderUseCase: CreateFolderUseCase,
    private readonly updateFolderUseCase: UpdateFolderUseCase,
    private readonly moveFolderUseCase: MoveFolderUseCase,
    private readonly deleteFolderUseCase: DeleteFolderUseCase,
    private readonly foldersValidator: FoldersValidator,
  ) {}

  @Get()
  async getFolder(
    @Query() query: Record<string, unknown>,
    @AuthenticatedUser() user: ISessionUser,
    @GetMetadata() metadata: IGetMetadata,
  ) {
    const payload = this.foldersValidator.validateGetFolderQuery(query);
    const input = payloadToGetFolderInput(payload, user, metadata);
    const output = await this.getFolderUseCase.execute(input);
    return mapGetFolderHttpResponse(output);
  }

  @Post()
  async createFolder(
    @Body() body: Record<string, unknown>,
    @AuthenticatedUser() user: ISessionUser,
    @GetMetadata() metadata: IGetMetadata,
  ) {
    const payload = this.foldersValidator.validateCreateFolder(body);
    const input = payloadToCreateFolderInput(payload, user, metadata);
    const output = await this.createFolderUseCase.execute(input);
    return mapCreateFolderHttpResponse(output);
  }

  @Patch(':id')
  async updateFolder(
    @Param() params: Record<string, unknown>,
    @Body() body: Record<string, unknown>,
    @AuthenticatedUser() user: ISessionUser,
    @GetMetadata() metadata: IGetMetadata,
  ) {
    const { id } = this.foldersValidator.validateIdParam(params);
    const payload = this.foldersValidator.validateUpdateFolder(body);
    const input = payloadToUpdateFolderInput(id, payload, user, metadata);
    const output = await this.updateFolderUseCase.execute(input);
    return mapUpdateFolderHttpResponse(output);
  }

  @Post(':id/move')
  async moveFolder(
    @Param() params: Record<string, unknown>,
    @Body() body: Record<string, unknown>,
    @AuthenticatedUser() user: ISessionUser,
    @GetMetadata() metadata: IGetMetadata,
  ) {
    const { id } = this.foldersValidator.validateIdParam(params);
    const payload = this.foldersValidator.validateMoveFolder(body);
    const input = payloadToMoveFolderInput(id, payload, user, metadata);
    const output = await this.moveFolderUseCase.execute(input);
    return mapMoveFolderHttpResponse(output);
  }

  @Delete(':id')
  async deleteFolder(
    @Param() params: Record<string, unknown>,
    @AuthenticatedUser() user: ISessionUser,
    @GetMetadata() metadata: IGetMetadata,
  ) {
    const { id } = this.foldersValidator.validateIdParam(params);
    const input = payloadToDeleteFolderInput(id, user, metadata);
    const output = await this.deleteFolderUseCase.execute(input);
    return mapDeleteFolderHttpResponse(output);
  }
}
