import { Injectable } from '@nestjs/common';
import { ajv } from 'src/modules/shared/presentation/http/validation/ajv-instance';
import { BaseValidator } from 'src/modules/shared/presentation/http/validation/base.validator';
import { grantRolePermissionPayloadSchema } from './schemas/grant-role-permission-payload.schema';
import type { IGrantRolePermissionPayload } from './schemas/grant-role-permission-payload.types';
import { roleIdParamSchema } from './schemas/role-id-param.schema';
import type { IRoleIdParamPayload } from './schemas/role-id-param.types';
import { rolePermissionParamsSchema } from './schemas/role-permission-params.schema';
import type { IRolePermissionParamsPayload } from './schemas/role-permission-params.types';

const validateRoleIdParam = ajv.compile(roleIdParamSchema);
const validateGrantRolePermissionPayload = ajv.compile(
  grantRolePermissionPayloadSchema,
);
const validateRolePermissionParams = ajv.compile(rolePermissionParamsSchema);

@Injectable()
export class AuthorizationValidator extends BaseValidator {
  validateRoleIdParam(raw: Record<string, unknown>): IRoleIdParamPayload {
    const normalized: IRoleIdParamPayload = {
      roleId: String(raw.roleId ?? ''),
    };
    return this.validateAndReturn<IRoleIdParamPayload>({
      validate: validateRoleIdParam,
      data: normalized,
      errorMessage: 'Некорректный идентификатор роли',
      logLabel: 'RoleIdParam',
      dataForSchema: normalized,
    });
  }

  validateGrantRolePermissionPayload(
    raw: Record<string, unknown>,
  ): IGrantRolePermissionPayload {
    return this.validateAndReturn<IGrantRolePermissionPayload>({
      validate: validateGrantRolePermissionPayload,
      data: raw as unknown as IGrantRolePermissionPayload,
      errorMessage: 'Некорректное тело запроса назначения permission роли',
      logLabel: 'GrantRolePermissionPayload',
      dataForSchema: raw,
    });
  }

  validateRolePermissionParams(
    raw: Record<string, unknown>,
  ): IRolePermissionParamsPayload {
    const normalized: IRolePermissionParamsPayload = {
      roleId: String(raw.roleId ?? ''),
      permissionId: String(raw.permissionId ?? ''),
    };
    return this.validateAndReturn<IRolePermissionParamsPayload>({
      validate: validateRolePermissionParams,
      data: normalized,
      errorMessage: 'Некорректные параметры role-permission',
      logLabel: 'RolePermissionParams',
      dataForSchema: normalized,
    });
  }
}
