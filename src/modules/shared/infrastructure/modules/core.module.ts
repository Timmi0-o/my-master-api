import { Global, Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { LOGGER_TOKEN } from 'src/modules/shared/domain/logging/logger.token';
import { ILoggerSymbol } from 'src/modules/shared/domain/services/i-logger.service';
import { DomainExceptionFilter } from '../filters/domain-exception.filter';
import { GlobalExceptionFilter } from '../filters/global-exception.filter';
import { PrismaModule } from '../persistence/prisma/prisma.module';
import { LoggerService } from '../services/logger.service';

@Global()
@Module({
  imports: [PrismaModule],
  providers: [
    LoggerService,
    { provide: ILoggerSymbol, useExisting: LoggerService },
    { provide: LOGGER_TOKEN, useExisting: LoggerService },
    { provide: APP_FILTER, useClass: DomainExceptionFilter },
    { provide: APP_FILTER, useClass: GlobalExceptionFilter },
  ],
  exports: [PrismaModule, ILoggerSymbol, LOGGER_TOKEN],
})
export class CoreModule {}
