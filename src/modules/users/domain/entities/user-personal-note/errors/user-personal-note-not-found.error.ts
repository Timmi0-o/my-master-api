import { DomainError } from '@shared/domain/errors';

export class UserPersonalNoteNotFoundError extends DomainError {
  constructor(reference?: { id?: string; referenceUserId?: string }) {
    super(
      'USER_PERSONAL_NOTE_NOT_FOUND',
      'User personal note not found',
      reference ?? {},
    );
  }
}
