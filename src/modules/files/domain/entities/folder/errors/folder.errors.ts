import { DomainError } from '@shared/domain/errors';

export class FolderNotFoundError extends DomainError {
  constructor(folderId: string) {
    super('FOLDER_NOT_FOUND', 'Папка не найдена', { folderId });
  }
}

export class FolderConflictError extends DomainError {
  constructor(message: string) {
    super('FOLDER_CONFLICT', message);
  }
}

export class FolderForbiddenError extends DomainError {
  constructor(message: string) {
    super('FOLDER_FORBIDDEN', message);
  }
}
