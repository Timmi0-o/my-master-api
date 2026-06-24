import {
  BadRequestException,
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
import { GrantFileAccessUseCase } from '../../../application/use-cases/file-access/grant-file-access.use-case';
import { RevokeFileAccessUseCase } from '../../../application/use-cases/file-access/revoke-file-access.use-case';
import { CreateFileShareUseCase } from '../../../application/use-cases/file-share/create-file-share.use-case';
import { RevokeFileShareUseCase } from '../../../application/use-cases/file-share/revoke-file-share.use-case';
import { CreateFilesUseCase } from '../../../application/use-cases/file/create-files.use-case';
import { DeleteFilesUseCase } from '../../../application/use-cases/file/delete-files.use-case';
import { GetFileUseCase } from '../../../application/use-cases/file/get-file.use-case';
import { GetFilesByIdsUseCase } from '../../../application/use-cases/file/get-files-by-ids.use-case';
import { MoveFileUseCase } from '../../../application/use-cases/file/move-file.use-case';
import { PresignedUploadUseCase } from '../../../application/use-cases/file/presigned-upload.use-case';
import { QueryFilesUseCase } from '../../../application/use-cases/file/query-files.use-case';
import { UpdateFileUseCase } from '../../../application/use-cases/file/update-file.use-case';
import { isAllowedFileUrl } from '../../../shared/constants/url-whitelist';
import { payloadToCreateFilesInput } from '../mappers/file/payload-to-create-files-input';
import { payloadToDeleteFilesInput } from '../mappers/file/payload-to-delete-files-input';
import { payloadToGetFileInput } from '../mappers/file/payload-to-get-file-input';
import { payloadToGetFilesByIdsInput } from '../mappers/file/payload-to-get-files-by-ids-input';
import { payloadToMoveFileInput } from '../mappers/file/payload-to-move-file-input';
import { payloadToPresignedUploadInput } from '../mappers/file/payload-to-presigned-upload-input';
import { payloadToQueryFilesInput } from '../mappers/file/payload-to-query-files-input';
import { payloadToUpdateFileInput } from '../mappers/file/payload-to-update-file-input';
import { payloadToGrantFileAccessInput } from '../mappers/file-access/payload-to-grant-file-access-input';
import { payloadToRevokeFileAccessInput } from '../mappers/file-access/payload-to-revoke-file-access-input';
import { payloadToCreateFileShareInput } from '../mappers/file-share/payload-to-create-file-share-input';
import { payloadToRevokeFileShareInput } from '../mappers/file-share/payload-to-revoke-file-share-input';
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
} from '../response/map-files-http-response';
import { FilesValidator } from '../validation/files.validator';

@Controller({ path: 'files', version: '1' })
@UseGuards(JwtAuthGuard)
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
    private readonly filesValidator: FilesValidator,
  ) {}

  @Post('presign')
  async presign(
    @Body() body: Record<string, unknown>,
    @AuthenticatedUser() user: ISessionUser,
    @GetMetadata() metadata: IGetMetadata,
  ) {
    const payload = this.filesValidator.validatePresignedUpload(body);
    const input = payloadToPresignedUploadInput(payload, user, metadata);
    const output = await this.presignedUploadUseCase.execute(input);
    return mapPresignedUploadHttpResponse(output);
  }

  @Get()
  async queryFiles(
    @Query() query: Record<string, unknown>,
    @AuthenticatedUser() user: ISessionUser,
    @GetMetadata() metadata: IGetMetadata,
  ) {
    const payload = this.filesValidator.validateQueryFiles(query);
    const input = payloadToQueryFilesInput(payload, user, metadata);
    const output = await this.queryFilesUseCase.execute(input);
    return mapQueryFilesHttpResponse(output);
  }

  @Post('batch')
  async getByIds(
    @Body() body: Record<string, unknown>,
    @AuthenticatedUser() user: ISessionUser,
    @GetMetadata() metadata: IGetMetadata,
  ) {
    const payload = this.filesValidator.validateGetFilesByIds(body);
    const input = payloadToGetFilesByIdsInput(payload, user, metadata);
    const output = await this.getFilesByIdsUseCase.execute(input);
    return mapGetFilesByIdsHttpResponse(output);
  }

  @Post()
  async createFiles(
    @Body() body: Record<string, unknown>,
    @AuthenticatedUser() user: ISessionUser,
    @GetMetadata() metadata: IGetMetadata,
  ) {
    const payload = this.filesValidator.validateCreateFiles(body);
    for (const file of payload.files) {
      if (!isAllowedFileUrl(file.fileUrl)) {
        throw new BadRequestException('URL файла не разрешён');
      }
    }

    const input = payloadToCreateFilesInput(payload, user, metadata);
    const output = await this.createFilesUseCase.execute(input);
    return mapCreateFilesHttpResponse(output);
  }

  @Get(':id')
  async getById(
    @Param() params: Record<string, unknown>,
    @AuthenticatedUser() user: ISessionUser,
    @GetMetadata() metadata: IGetMetadata,
  ) {
    const { id } = this.filesValidator.validateIdParam(params);
    const input = payloadToGetFileInput(id, {}, user, metadata);
    const output = await this.getFileUseCase.execute(input);
    return mapGetFileByIdHttpResponse(output);
  }

  @Patch(':id')
  async update(
    @Param() params: Record<string, unknown>,
    @Body() body: Record<string, unknown>,
    @AuthenticatedUser() user: ISessionUser,
    @GetMetadata() metadata: IGetMetadata,
  ) {
    const { id } = this.filesValidator.validateIdParam(params);
    const payload = this.filesValidator.validateUpdateFile(body);
    const input = payloadToUpdateFileInput(id, payload, user, metadata);
    const output = await this.updateFileUseCase.execute(input);
    return mapUpdateFileHttpResponse(output);
  }

  @Post(':id/move')
  async move(
    @Param() params: Record<string, unknown>,
    @Body() body: Record<string, unknown>,
    @AuthenticatedUser() user: ISessionUser,
    @GetMetadata() metadata: IGetMetadata,
  ) {
    const { id } = this.filesValidator.validateIdParam(params);
    const payload = this.filesValidator.validateMoveFile(body);
    const input = payloadToMoveFileInput(id, payload, user, metadata);
    const output = await this.moveFileUseCase.execute(input);
    return mapMoveFileHttpResponse(output);
  }

  @Delete()
  async deleteMany(
    @Body() body: Record<string, unknown>,
    @AuthenticatedUser() user: ISessionUser,
    @GetMetadata() metadata: IGetMetadata,
  ) {
    const payload = this.filesValidator.validateDeleteFiles(body);
    const input = payloadToDeleteFilesInput(payload, user, metadata);
    const output = await this.deleteFilesUseCase.execute(input);
    return mapDeleteFilesHttpResponse(output);
  }

  @Post(':id/access')
  async grantAccess(
    @Param() params: Record<string, unknown>,
    @Body() body: Record<string, unknown>,
    @AuthenticatedUser() user: ISessionUser,
    @GetMetadata() metadata: IGetMetadata,
  ) {
    const { id } = this.filesValidator.validateIdParam(params);
    const payload = this.filesValidator.validateGrantFileAccess(body);
    const input = payloadToGrantFileAccessInput(id, payload, user, metadata);
    const output = await this.grantFileAccessUseCase.execute(input);
    return mapGrantFileAccessHttpResponse(output);
  }

  @Delete(':id/access/:accessId')
  async revokeAccess(
    @Param() params: Record<string, unknown>,
    @AuthenticatedUser() user: ISessionUser,
    @GetMetadata() metadata: IGetMetadata,
  ) {
    const { id, accessId } = this.filesValidator.validateRevokeAccessParams(params);
    const input = payloadToRevokeFileAccessInput(id, accessId, user, metadata);
    await this.revokeFileAccessUseCase.execute(input);
    return mapRevokeFileAccessHttpResponse();
  }

  @Post(':id/shares')
  async createShare(
    @Param() params: Record<string, unknown>,
    @Body() body: Record<string, unknown>,
    @AuthenticatedUser() user: ISessionUser,
    @GetMetadata() metadata: IGetMetadata,
  ) {
    const { id } = this.filesValidator.validateIdParam(params);
    const payload = this.filesValidator.validateCreateFileShare(body);
    const input = payloadToCreateFileShareInput(id, payload, user, metadata);
    const output = await this.createFileShareUseCase.execute(input);
    return mapCreateFileShareHttpResponse(output);
  }

  @Delete(':id/shares/:shareId')
  async revokeShare(
    @Param() params: Record<string, unknown>,
    @AuthenticatedUser() user: ISessionUser,
    @GetMetadata() metadata: IGetMetadata,
  ) {
    const { shareId } = this.filesValidator.validateRevokeShareParams(params);
    const input = payloadToRevokeFileShareInput(shareId, user, metadata);
    await this.revokeFileShareUseCase.execute(input);
    return mapRevokeFileShareHttpResponse();
  }
}
