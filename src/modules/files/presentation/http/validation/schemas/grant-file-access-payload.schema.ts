import { JSONSchemaType } from 'ajv';
import { idSchema } from '@shared/presentation/http/validation/schemas/common.schemas';
import {
  FileAccessPermission,
  FileAccessTargetType,
} from 'src/modules/files/domain/entities/file';
import type { IGrantFileAccessPayload } from './grant-file-access-payload.types';

const targetTypeValues = Object.values(FileAccessTargetType);
const permissionValues = Object.values(FileAccessPermission);

export const grantFileAccessPayloadSchema: JSONSchemaType<IGrantFileAccessPayload> =
  {
    type: 'object',
    properties: {
      targetType: { type: 'string', enum: targetTypeValues },
      targetId: idSchema,
      permissions: {
        type: 'array',
        items: { type: 'string', enum: permissionValues },
        minItems: 1,
      },
      reason: { type: 'string', nullable: true },
      expiresAt: { type: 'string', format: 'date-time', nullable: true },
    },
    required: ['targetType', 'targetId', 'permissions'],
    additionalProperties: false,
  };
