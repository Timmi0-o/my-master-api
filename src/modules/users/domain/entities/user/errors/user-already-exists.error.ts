import { DomainError } from '@shared/domain/errors';

export class UserAlreadyExistsError extends DomainError {
  constructor(field: 'email' | 'username', value: string) {
    super(
      'USER_ALREADY_EXISTS',
      field === 'email'
        ? 'Пользователь с таким email уже существует'
        : 'Пользователь с таким именем уже существует',
      { field, value },
    );
  }
}
