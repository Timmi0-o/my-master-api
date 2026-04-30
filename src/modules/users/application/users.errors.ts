export class UserNotFoundError extends Error {
  constructor() {
    super('User not found');
  }
}

export class UserAlreadyExistsError extends Error {
  constructor(public readonly field: 'email' | 'phone' | 'username') {
    super(`User with this ${field} already exists`);
  }
}
