import { Injectable } from '@nestjs/common';
import { ajv } from '@shared/presentation/http/validation/ajv-instance';
import { BaseValidator } from '@shared/presentation/http/validation/base.validator';
import { idSchema } from '@shared/presentation/http/validation/schemas/common.schemas';
import {
  createFolderPayloadSchema,
  moveFolderPayloadSchema,
  updateFolderPayloadSchema,
} from './schemas/folder-payload.schema';
import type { ICreateFolderPayload } from './schemas/create-folder-payload.types';
import type { IUpdateFolderPayload } from './schemas/update-folder-payload.types';
import type { IMoveFolderPayload } from './schemas/move-folder-payload.types';
import type { IGetFolderQueryPayload } from './schemas/get-folder-query.types';

const validateCreateFolder = ajv.compile(createFolderPayloadSchema);
const validateUpdateFolder = ajv.compile(updateFolderPayloadSchema);
const validateMoveFolder = ajv.compile(moveFolderPayloadSchema);
const validateIdParam = ajv.compile({
  type: 'object',
  properties: { id: idSchema },
  required: ['id'],
  additionalProperties: false,
});

@Injectable()
export class FoldersValidator extends BaseValidator {
  validateGetFolderQuery(query: Record<string, unknown>): IGetFolderQueryPayload {
    return {
      ownerKind: String(query.ownerKind ?? ''),
      ownerId: String(query.ownerId ?? ''),
      path: query.path != null ? String(query.path) : '/',
    };
  }

  validateCreateFolder(body: Record<string, unknown>): ICreateFolderPayload {
    return this.validateAndReturn({
      validate: validateCreateFolder,
      data: body as unknown as ICreateFolderPayload,
      errorMessage: 'Некорректные данные для создания папки',
      logLabel: 'CreateFolderPayload',
    });
  }

  validateUpdateFolder(body: Record<string, unknown>): IUpdateFolderPayload {
    return this.validateAndReturn({
      validate: validateUpdateFolder,
      data: body as unknown as IUpdateFolderPayload,
      errorMessage: 'Некорректные данные для обновления папки',
      logLabel: 'UpdateFolderPayload',
    });
  }

  validateMoveFolder(body: Record<string, unknown>): IMoveFolderPayload {
    return this.validateAndReturn({
      validate: validateMoveFolder,
      data: body as unknown as IMoveFolderPayload,
      errorMessage: 'Некорректные данные для перемещения папки',
      logLabel: 'MoveFolderPayload',
    });
  }

  validateIdParam(raw: Record<string, unknown>): { id: string } {
    const normalized = { id: String(raw.id ?? '') };
    return this.validateAndReturn({
      validate: validateIdParam,
      data: normalized,
      errorMessage: 'Некорректный идентификатор папки',
      logLabel: 'FolderIdParam',
      dataForSchema: normalized,
    });
  }
}
