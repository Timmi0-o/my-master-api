import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { AppointmentsModule } from './modules/appointments/appointments.module';
import { MastersModule } from './modules/masters/masters.module';
import { CoreModule } from './modules/shared/infrastructure/modules/core.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [CoreModule, UsersModule, AuthModule, MastersModule, AppointmentsModule],
})
export class AppModule {}
