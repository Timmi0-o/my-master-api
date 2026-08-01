import { ICreateMasterProfileInput } from '@modules/masters/domain/entities';
import { IMasterProfileRepository } from '@modules/masters/domain/repositories';
import { ICreateUserProfileInput } from '@modules/users/domain/entities';
import { IUserProfileRepository } from '@modules/users/domain/repositories';
import type { ITransactionManager } from '@shared/domain/transactions';
import * as bcrypt from 'bcrypt';
import { Logger } from '@nestjs/common';
import { ERoleIdentifier } from 'src/modules/authorization/domain/entities/role/role.enum';
import { SYSTEM_ROLE_IDS } from 'src/modules/authorization/domain/entities/role/system-role-ids';
import {
  EUserLanguage,
  EUserStatus,
  UserAlreadyExistsError,
} from 'src/modules/users/domain/entities/user';
import type { IUserRepository } from 'src/modules/users/domain/repositories/user/i-user.repository';
import type { IAuthResponse } from '../../domain/auth.types';
import type { LoginUseCase } from './login.use-case';
import type { SendVerificationEmailUseCase } from './send-verification-email.use-case';

const BCRYPT_ROUNDS = 10;

interface IRegisterInput {
  email: string;
  username: string;
  password: string;
  language?: EUserLanguage;
}

interface ILoginMetadata {
  ipAddress?: string | null;
  userAgent?: string | null;
}

export class RegisterUseCase {
  private readonly logger = new Logger(RegisterUseCase.name);

  constructor(
    private readonly transactionManager: ITransactionManager,
    private readonly userRepository: IUserRepository,
    private readonly loginUseCase: LoginUseCase,
    private readonly masterProfileRepository: IMasterProfileRepository,
    private readonly userProfileRepository: IUserProfileRepository,
    private readonly sendVerificationEmailUseCase: SendVerificationEmailUseCase,
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

    const user = await this.transactionManager.runInTransaction(
      async (scope) => {
        const createdUser = await this.userRepository.create(
          {
            email: input.email,
            username: input.username,
            passwordHash,
            roleId: SYSTEM_ROLE_IDS[ERoleIdentifier.USER],
            status: EUserStatus.ACTIVE,
            name: input.username,
            surname: input.username,
            language: input.language ?? EUserLanguage.RU,
            phone: null,
            patronymic: null,
            emailVerifiedAt: null,
          },
          scope,
        );

        const createMasterProfileInput: ICreateMasterProfileInput = {
          rating: 0,
          userId: createdUser.id,
          displayName: createdUser.email,
          description: '',
        };

        await this.masterProfileRepository.create(
          createMasterProfileInput,
          scope,
        );

        const createUserProfileInput: ICreateUserProfileInput = {
          userId: createdUser.id,
          displayName: createdUser.email,
          rating: 0,
        };

        await this.userProfileRepository.create(createUserProfileInput, scope);

        return createdUser;
      },
    );

    try {
      await this.sendVerificationEmailUseCase.sendForUser(
        user.id,
        user.email,
        user.language,
      );
    } catch (error) {
      this.logger.warn(
        `Failed to send verification email to ${user.email}: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
    }

    return this.loginUseCase.execute(user, metadata);
  }
}
