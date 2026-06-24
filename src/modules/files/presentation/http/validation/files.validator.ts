import { Injectable } from '@nestjs/common';
import { ajv } from '@shared/presentation/http/validation/ajv-instance';
import { BaseValidator } from '@shared/presentation/http/validation/base.validator';
import { idSchema } from '@shared/presentation/http/validation/schemas/common.schemas';
import type { FilePurpose } from '../../../domain/entities/file';
import { presignedUploadPayloadSchema } from './schemas/presigned-upload-payload.schema';
import type { IPresignedUploadPayload } from './schemas/presigned-upload-payload.schema';
import { getFilesByIdsPayloadSchema } from './schemas/get-files-by-ids-payload.schema';
import type { IGetFilesByIdsPayload } from './schemas/get-files-by-ids-payload.schema';
import { createFilesPayloadSchema } from './schemas/create-files-payload.schema';
import type { ICreateFilesPayload } from './schemas/create-files-payload.schema';
import { updateFilePayloadSchema } from './schemas/update-file-payload.schema';
import type { IUpdateFilePayload } from './schemas/update-file-payload.types';
import { moveFilePayloadSchema } from './schemas/move-file-payload.schema';
import type { IMoveFilePayload } from './schemas/move-file-payload.types';
import { deleteFilesPayloadSchema } from './schemas/delete-files-payload.schema';
import type { IDeleteFilesPayload } from './schemas/delete-files-payload.types';
import { grantFileAccessPayloadSchema } from './schemas/grant-file-access-payload.schema';
import type { IGrantFileAccessPayload } from './schemas/grant-file-access-payload.types';
import { createFileSharePayloadSchema } from './schemas/create-file-share-payload.schema';
import type { ICreateFileSharePayload } from './schemas/create-file-share-payload.types';
import type { IQueryFilesQueryPayload } from './schemas/query-files-query.types';

const validatePresignedUpload = ajv.compile(presignedUploadPayloadSchema);
const validateGetFilesByIds = ajv.compile(getFilesByIdsPayloadSchema);
const validateCreateFiles = ajv.compile(createFilesPayloadSchema);
const validateUpdateFile = ajv.compile(updateFilePayloadSchema);
const validateMoveFile = ajv.compile(moveFilePayloadSchema);
const validateDeleteFiles = ajv.compile(deleteFilesPayloadSchema);
const validateGrantFileAccess = ajv.compile(grantFileAccessPayloadSchema);
const validateCreateFileShare = ajv.compile(createFileSharePayloadSchema);
const validateIdParam = ajv.compile({
  type: 'object',
  properties: { id: idSchema },
  required: ['id'],
  additionalProperties: false,
});
const validateRevokeAccessParams = ajv.compile({
  type: 'object',
  properties: {
    id: idSchema,
    accessId: idSchema,
  },
  required: ['id', 'accessId'],
  additionalProperties: false,
});
const validateRevokeShareParams = ajv.compile({
  type: 'object',
  properties: {
    id: idSchema,
    shareId: idSchema,
  },
  required: ['id', 'shareId'],
  additionalProperties: false,
});

@Injectable()
export class FilesValidator extends BaseValidator {
  validatePresignedUpload(body: Record<string, unknown>): IPresignedUploadPayload {
    return this.validateAndReturn({
      validate: validatePresignedUpload,
      data: body as unknown as IPresignedUploadPayload,
      errorMessage: 'Некорректные данные для presigned upload',
      logLabel: 'PresignedUploadPayload',
    });
  }

  validateQueryFiles(query: Record<string, unknown>): IQueryFilesQueryPayload {
    const payload: IQueryFilesQueryPayload = {};
    if (query.ownerKind != null) payload.ownerKind = String(query.ownerKind);
    if (query.ownerId != null) payload.ownerId = String(query.ownerId);
    if (query.purpose != null) payload.purpose = String(query.purpose) as FilePurpose;
    if (query.take != null) payload.take = Number(query.take);
    if (query.skip != null) payload.skip = Number(query.skip);
    return payload;
  }

  validateGetFilesByIds(body: Record<string, unknown>): IGetFilesByIdsPayload {
    return this.validateAndReturn({
      validate: validateGetFilesByIds,
      data: body as unknown as IGetFilesByIdsPayload,
      errorMessage: 'Некорректные идентификаторы файлов',
      logLabel: 'GetFilesByIdsPayload',
    });
  }

  validateCreateFiles(body: Record<string, unknown>): ICreateFilesPayload {
    return this.validateAndReturn({
      validate: validateCreateFiles,
      data: body as unknown as ICreateFilesPayload,
      errorMessage: 'Некорректные данные для создания файлов',
      logLabel: 'CreateFilesPayload',
    });
  }

  validateUpdateFile(body: Record<string, unknown>): IUpdateFilePayload {
    return this.validateAndReturn({
      validate: validateUpdateFile,
      data: body as unknown as IUpdateFilePayload,
      errorMessage: 'Некорректные данные для обновления файла',
      logLabel: 'UpdateFilePayload',
    });
  }

  validateMoveFile(body: Record<string, unknown>): IMoveFilePayload {
    return this.validateAndReturn({
      validate: validateMoveFile,
      data: body as unknown as IMoveFilePayload,
      errorMessage: 'Некорректные данные для перемещения файла',
      logLabel: 'MoveFilePayload',
    });
  }

  validateDeleteFiles(body: Record<string, unknown>): IDeleteFilesPayload {
    return this.validateAndReturn({
      validate: validateDeleteFiles,
      data: body as unknown as IDeleteFilesPayload,
      errorMessage: 'Некорректные идентификаторы для удаления',
      logLabel: 'DeleteFilesPayload',
    });
  }

  validateGrantFileAccess(body: Record<string, unknown>): IGrantFileAccessPayload {
    return this.validateAndReturn({
      validate: validateGrantFileAccess,
      data: body as unknown as IGrantFileAccessPayload,
      errorMessage: 'Некорректные данные для выдачи доступа',
      logLabel: 'GrantFileAccessPayload',
    });
  }

  validateCreateFileShare(body: Record<string, unknown>): ICreateFileSharePayload {
    return this.validateAndReturn({
      validate: validateCreateFileShare,
      data: body as unknown as ICreateFileSharePayload,
      errorMessage: 'Некорректные данные для создания share-ссылки',
      logLabel: 'CreateFileSharePayload',
    });
  }

  validateIdParam(raw: Record<string, unknown>): { id: string } {
    const normalized = { id: String(raw.id ?? '') };
    return this.validateAndReturn({
      validate: validateIdParam,
      data: normalized,
      errorMessage: 'Некорректный идентификатор',
      logLabel: 'FileIdParam',
      dataForSchema: normalized,
    });
  }

  validateRevokeAccessParams(raw: Record<string, unknown>): {
    id: string;
    accessId: string;
  } {
    const normalized = {
      id: String(raw.id ?? ''),
      accessId: String(raw.accessId ?? ''),
    };
    return this.validateAndReturn({
      validate: validateRevokeAccessParams,
      data: normalized,
      errorMessage: 'Некорректные параметры отзыва доступа',
      logLabel: 'RevokeFileAccessParams',
      dataForSchema: normalized,
    });
  }

  validateRevokeShareParams(raw: Record<string, unknown>): {
    id: string;
    shareId: string;
  } {
    const normalized = {
      id: String(raw.id ?? ''),
      shareId: String(raw.shareId ?? ''),
    };
    return this.validateAndReturn({
      validate: validateRevokeShareParams,
      data: normalized,
      errorMessage: 'Некорректные параметры отзыва share',
      logLabel: 'RevokeFileShareParams',
      dataForSchema: normalized,
    });
  }
}
