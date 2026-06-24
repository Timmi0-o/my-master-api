import {
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import type { DomainErrorMapper } from '@shared/infrastructure/filters/domain-error-mappers/domain-error-mapper.types';
import {
  FileConflictError,
  FileForbiddenError,
  FileNotFoundError,
  FileShareForbiddenError,
  FileShareNotFoundError,
} from 'src/modules/files/domain/entities/file';
import {
  FolderConflictError,
  FolderForbiddenError,
  FolderNotFoundError,
} from 'src/modules/files/domain/entities/folder';

export const mapFilesDomainError: DomainErrorMapper = (error) => {
  if (
    error instanceof FileNotFoundError ||
    error instanceof FileShareNotFoundError ||
    error instanceof FolderNotFoundError
  ) {
    return new NotFoundException(error.message);
  }

  if (
    error instanceof FileForbiddenError ||
    error instanceof FileShareForbiddenError ||
    error instanceof FolderForbiddenError
  ) {
    return new ForbiddenException(error.message);
  }

  if (
    error instanceof FileConflictError ||
    error instanceof FolderConflictError
  ) {
    return new ConflictException(error.message);
  }

  return null;
};
