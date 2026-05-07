import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { ILoggerSymbol } from './modules/shared/domain/services/i-logger.service';
import { GlobalExceptionFilter } from './modules/shared/infrastructure/filters/global-exception.filter';
import { LoggerService } from './modules/shared/infrastructure/services/logger.service';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [UsersModule, AuthModule],
  controllers: [],
  providers: [
    LoggerService,
    {
      provide: ILoggerSymbol,
      useExisting: LoggerService,
    },
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
  ],
})
export class AppModule {}
