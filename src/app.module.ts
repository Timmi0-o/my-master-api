import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { AuthorizationModule } from './modules/authorization/authorization.module';
import { AppointmentsModule } from './modules/appointments/appointments.module';
import { FilesModule } from './modules/files/files.module';
import { MastersModule } from './modules/masters/masters.module';
import { SearchModule } from './modules/search/search.module';
import { CoreModule } from './modules/shared/infrastructure/modules/core.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    CoreModule,
    UsersModule,
    AuthModule,
    AuthorizationModule,
    MastersModule,
    AppointmentsModule,
    FilesModule,
    SearchModule,
  ],
})
export class AppModule {}
