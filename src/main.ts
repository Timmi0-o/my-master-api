import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  ILoggerSymbol,
  type ILoggerService,
} from './modules/shared/domain/services/i-logger.service';
import { LoggingInterceptor } from './modules/shared/infrastructure/interceptors/logging.interceptor';
import { ResponseInterceptor } from './modules/shared/infrastructure/interceptors/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const logger = app.get<ILoggerService>(ILoggerSymbol);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.useGlobalInterceptors(
    new LoggingInterceptor(logger),
    new ResponseInterceptor(),
  );

  await app.listen(process.env.APP_PORT ?? 6666, () => {
    Logger.log(`Server is running on port ${process.env.APP_PORT ?? 6666}`);
  });
}

void bootstrap();
