import {
  ForbiddenException,
  NotFoundException,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import {
  InsufficientPermissionsError,
  StaffAccessRequiredError,
  UnauthenticatedError,
} from 'src/modules/authorization/domain/auth/errors/authorization.errors';
import {
  PermissionNotFoundError,
} from 'src/modules/authorization/domain/entities/permission';
import { RoleNotFoundError } from 'src/modules/authorization/domain/entities/role';
import {
  RolePermissionAlreadyExistsError,
  RolePermissionNotFoundError,
} from 'src/modules/authorization/domain/entities/role-permission';
import type { DomainErrorMapper } from './domain-error-mapper.types';

export const mapAuthorizationDomainError: DomainErrorMapper = (error) => {
  if (error instanceof UnauthenticatedError) {
    return new UnauthorizedException(error.message);
  }
  if (
    error instanceof InsufficientPermissionsError ||
    error instanceof StaffAccessRequiredError
  ) {
    return new ForbiddenException(error.message);
  }
  if (
    error instanceof RoleNotFoundError ||
    error instanceof PermissionNotFoundError ||
    error instanceof RolePermissionNotFoundError
  ) {
    return new NotFoundException(error.message);
  }
  if (error instanceof RolePermissionAlreadyExistsError) {
    return new ConflictException(error.message);
  }
  return null;
};
