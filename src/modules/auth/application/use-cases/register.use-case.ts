import * as bcrypt from 'bcrypt';
import type { LoginUseCase } from './login.use-case';
import {
  EUserLanguage,
  EUserRole,
  EUserStatus,
  UserAlreadyExistsError,
} from 'src/modules/users/domain/entities/user';
import type { IUserRepository } from 'src/modules/users/domain/repositories/user/i-user.repository';
import type { IAuthResponse } from '../../domain/auth.types';
import type { ITransactionManager } from '@shared/domain/transactions';

const BCRYPT_ROUNDS = 10;

interface IRegisterInput {
  email: string;
  username: string;
  password: string;
}

interface ILoginMetadata {
  ipAddress?: string | null;
  userAgent?: string | null;
}

export class RegisterUseCase {
  constructor(
    private readonly transactionManager: ITransactionManager,
    private readonly userRepository: IUserRepository,
    private readonly loginUseCase: LoginUseCase,
  ) {}

  async execute(
    input: IRegisterInput,
    metadata?: ILoginMetadata,
  ): Promise<{ data: IAuthResponse; success: boolean }> {
    const existingEmail = await this.userRepository.findByEmail(input.email);
    if (existingEmail && !existingEmail.deletedAt) {
      throw new UserAlreadyExistsError('email', input.email);
    }

    const existingUsername = await this.userRepository.findByEmailOrUsername(
      input.username,
    );
    if (
      existingUsername &&
      !existingUsername.deletedAt &&
      existingUsername.username === input.username
    ) {
      throw new UserAlreadyExistsError('username', input.username);
    }

    const passwordHash = await bcrypt.hash(input.password, BCRYPT_ROUNDS);

    const user = await this.transactionManager.runInTransaction((scope) =>
      this.userRepository.create(
        {
          email: input.email,
          username: input.username,
          passwordHash,
          role: EUserRole.USER,
          status: EUserStatus.ACTIVE,
          name: input.username,
          surname: input.username,
          language: EUserLanguage.RU,
          phone: null,
          patronymic: null,
        },
        scope,
      ),
    );

    return this.loginUseCase.execute(user, metadata);
  }
}
