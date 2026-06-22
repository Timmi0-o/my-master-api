import { Global, Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { LOGGER_TOKEN } from '@shared/domain/logging/logger.token';
import { TRANSACTION_MANAGER_TOKEN } from '@shared/domain/transactions';
import { ILoggerSymbol } from '@shared/domain/services/i-logger.service';
import { DomainExceptionFilter } from '../filters/domain-exception.filter';
import { GlobalExceptionFilter } from '../filters/global-exception.filter';
import { PrismaModule } from '../persistence/prisma/prisma.module';
import { PrismaTransactionManager } from '../persistence/transactions';
import { LoggerService } from '../services/logger.service';

@Global()
@Module({
  imports: [PrismaModule],
  providers: [
    LoggerService,
    PrismaTransactionManager,
    { provide: ILoggerSymbol, useExisting: LoggerService },
    { provide: LOGGER_TOKEN, useExisting: LoggerService },
    {
      provide: TRANSACTION_MANAGER_TOKEN,
      useExisting: PrismaTransactionManager,
    },
    { provide: APP_FILTER, useClass: DomainExceptionFilter },
    { provide: APP_FILTER, useClass: GlobalExceptionFilter },
  ],
  exports: [
    PrismaModule,
    ILoggerSymbol,
    LOGGER_TOKEN,
    TRANSACTION_MANAGER_TOKEN,
  ],
})
export class CoreModule {}
