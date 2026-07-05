import { Module } from '@nestjs/common';
import { USER_REPOSITORY_TOKEN } from '../../../domain/repositories/user/user.repository.tokens';
import { PrismaUserRepository } from '../../persistence/repositories/user/prisma-user.repository';

@Module({
  providers: [
    {
      provide: USER_REPOSITORY_TOKEN,
      useClass: PrismaUserRepository,
    },
  ],
  exports: [USER_REPOSITORY_TOKEN],
})
export class UserRepositoryModule {}
