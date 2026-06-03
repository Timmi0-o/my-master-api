import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { MastersModule } from './modules/masters/masters.module';
import { CoreModule } from './modules/shared/infrastructure/modules/core.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [CoreModule, UsersModule, AuthModule, MastersModule],
})
export class AppModule {}
