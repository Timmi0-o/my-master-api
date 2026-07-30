import { Module } from '@nestjs/common';
import { TRANSACTION_MANAGER_TOKEN } from '@shared/domain/transactions';
import type { ITransactionManager } from '@shared/domain/transactions';
import { GetUserPersonalNoteByReferenceUseCase } from '../../../application/use-cases/user-personal-note/get-user-personal-note-by-reference.use-case';
import { UpsertUserPersonalNoteUseCase } from '../../../application/use-cases/user-personal-note/upsert-user-personal-note.use-case';
import type { IUserPersonalNoteRepository } from '../../../domain/repositories/user-personal-note/i-user-personal-note.repository';
import { USER_PERSONAL_NOTE_REPOSITORY_TOKEN } from '../../../domain/repositories/user-personal-note/user-personal-note.repository.tokens';
import type { IUserRepository } from '../../../domain/repositories/user/i-user.repository';
import { USER_REPOSITORY_TOKEN } from '../../../domain/repositories/user/user.repository.tokens';
import { PrismaUserPersonalNoteRepository } from '../../persistence/repositories/user-personal-note/prisma-user-personal-note.repository';
import { UserRepositoryModule } from '../user-repository/user-repository.module';

@Module({
  imports: [UserRepositoryModule],
  providers: [
    {
      provide: USER_PERSONAL_NOTE_REPOSITORY_TOKEN,
      useClass: PrismaUserPersonalNoteRepository,
    },
    {
      provide: GetUserPersonalNoteByReferenceUseCase,
      useFactory: (repo: IUserPersonalNoteRepository) =>
        new GetUserPersonalNoteByReferenceUseCase(repo),
      inject: [USER_PERSONAL_NOTE_REPOSITORY_TOKEN],
    },
    {
      provide: UpsertUserPersonalNoteUseCase,
      useFactory: (
        transactionManager: ITransactionManager,
        noteRepo: IUserPersonalNoteRepository,
        userRepo: IUserRepository,
      ) =>
        new UpsertUserPersonalNoteUseCase(
          transactionManager,
          noteRepo,
          userRepo,
        ),
      inject: [
        TRANSACTION_MANAGER_TOKEN,
        USER_PERSONAL_NOTE_REPOSITORY_TOKEN,
        USER_REPOSITORY_TOKEN,
      ],
    },
  ],
  exports: [
    USER_PERSONAL_NOTE_REPOSITORY_TOKEN,
    GetUserPersonalNoteByReferenceUseCase,
    UpsertUserPersonalNoteUseCase,
  ],
})
export class UserPersonalNoteModule {}
