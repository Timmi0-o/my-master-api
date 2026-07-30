import { DomainError } from '@shared/domain/errors';

export class UserPersonalNoteCannotTargetSelfError extends DomainError {
  constructor(userId: string) {
    super(
      'USER_PERSONAL_NOTE_CANNOT_TARGET_SELF',
      'Cannot create a personal note about yourself',
      { userId },
    );
  }
}
