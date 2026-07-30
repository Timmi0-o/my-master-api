import { DomainError } from '@shared/domain/errors';

export class UserPersonalNoteAlreadyExistsError extends DomainError {
  constructor(ownerUserId: string, referenceUserId: string) {
    super(
      'USER_PERSONAL_NOTE_ALREADY_EXISTS',
      'User personal note already exists',
      { ownerUserId, referenceUserId },
    );
  }
}
