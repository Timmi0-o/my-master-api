import { DomainError } from '@shared/domain/errors';

export class FileNotFoundError extends DomainError {
  constructor(fileId: string) {
    super('FILE_NOT_FOUND', 'Файл не найден', { fileId });
  }
}

export class FileForbiddenError extends DomainError {
  constructor(fileId: string) {
    super('FILE_FORBIDDEN', 'Нет доступа к файлу', { fileId });
  }
}

export class FileConflictError extends DomainError {
  constructor(message: string) {
    super('FILE_CONFLICT', message);
  }
}

export class FileShareNotFoundError extends DomainError {
  constructor(token: string) {
    super('FILE_SHARE_NOT_FOUND', 'Ссылка на файл не найдена', { token });
  }
}

export class FileShareForbiddenError extends DomainError {
  constructor(message: string) {
    super('FILE_SHARE_FORBIDDEN', message);
  }
}
