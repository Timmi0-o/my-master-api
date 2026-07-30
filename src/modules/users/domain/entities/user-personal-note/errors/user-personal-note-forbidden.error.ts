import { DomainError } from '@shared/domain/errors';

export class UserPersonalNoteForbiddenError extends DomainError {
  constructor(userPersonalNoteId?: string) {
    super(
      'USER_PERSONAL_NOTE_FORBIDDEN',
      'User personal note access forbidden',
      userPersonalNoteId ? { userPersonalNoteId } : {},
    );
  }
}
